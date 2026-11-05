let webgl: boolean | undefined;

/** three.js needs WebGL 2. Asked once, and the test context is handed straight back. */
export function webglSupported() {
  if (webgl === undefined) {
    const gl = document.createElement("canvas").getContext("webgl2");
    webgl = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  return webgl;
}
