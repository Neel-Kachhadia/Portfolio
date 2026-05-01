import fs from "node:fs/promises";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const guard = setTimeout(() => {
    console.error("QA timed out inside script");
    process.exit(2);
  }, 45000);
  const port = process.argv[2] ?? "9224";
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();

  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const messageId = ++id;
      pending.set(messageId, { resolve, reject });
      ws.send(JSON.stringify({ id: messageId, method, params, sessionId }));
    });

  async function qa(width, height, mobile, file) {
    const target = await send("Target.createTarget", {
      url: "http://127.0.0.1:3000",
    });
    const attached = await send("Target.attachToTarget", {
      targetId: target.targetId,
      flatten: true,
    });
    const sessionId = attached.sessionId;
    await send("Page.enable", {}, sessionId);
    await send("Runtime.enable", {}, sessionId);
    console.log("metrics override", width, height);
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    }, sessionId);
    send("Page.navigate", { url: "http://127.0.0.1:3000" }, sessionId).catch(() => {});
    console.log("sleep", width);
    await sleep(7000);
    console.log("evaluate", width);
    const metrics = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const canvases = Array.from(document.querySelectorAll('canvas'));
        const canvasStats = canvases.map((canvas) => {
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          if (!gl) return { width: canvas.width, height: canvas.height, nonzero: -1, sampleSum: -1 };
          const w = gl.drawingBufferWidth;
          const h = gl.drawingBufferHeight;
          const sw = Math.min(64, w);
          const sh = Math.min(64, h);
          const sx = Math.max(0, Math.floor(w / 2 - sw / 2));
          const sy = Math.max(0, Math.floor(h / 2 - sh / 2));
          const pixels = new Uint8Array(sw * sh * 4);
          try { gl.readPixels(sx, sy, sw, sh, gl.RGBA, gl.UNSIGNED_BYTE, pixels); }
          catch (error) { return { width: w, height: h, nonzero: -2, sampleSum: -2, error: String(error) }; }
          let nonzero = 0;
          let sampleSum = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const sum = pixels[i] + pixels[i + 1] + pixels[i + 2] + pixels[i + 3];
            sampleSum += sum;
            if (sum > 0) nonzero += 1;
          }
          return { width: w, height: h, nonzero, sampleSum };
        });
        const overflowers = Array.from(document.body.querySelectorAll('*'))
          .map((el) => ({ tag: el.tagName, cls: el.className && String(el.className).slice(0, 80), right: Math.round(el.getBoundingClientRect().right), left: Math.round(el.getBoundingClientRect().left) }))
          .filter((item) => item.right > window.innerWidth + 2 || item.left < -2)
          .slice(0, 12);
        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          href: location.href,
          readyState: document.readyState,
          bodyTextLength: document.body.innerText.length,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          h1: document.querySelector('h1')?.textContent?.trim(),
          canvasCount: canvases.length,
          canvasStats,
          overflowers,
        };
      })()`,
    }, sessionId);
    await send("Target.closeTarget", { targetId: target.targetId });
    return {
      ...metrics.result.value,
      file,
    };
  }

  console.log("qa desktop");
  const desktop = await qa(1440, 1100, false, "neel-os-desktop-cdp.png");
  console.log("qa mobile");
  const mobile = await qa(390, 900, true, "neel-os-mobile-cdp.png");
  ws.close();
  clearTimeout(guard);

  console.log(JSON.stringify({ desktop, mobile }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
