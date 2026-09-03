const R=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;function _(e,a,t){const E=(n,o)=>{const T=e.createShader(n);if(e.shaderSource(T,o),e.compileShader(T),!e.getShaderParameter(T,e.COMPILE_STATUS))throw new Error(`shader compile failed: ${e.getShaderInfoLog(T)}
${o}`);return T},r=e.createProgram();if(e.attachShader(r,E(e.VERTEX_SHADER,a)),e.attachShader(r,E(e.FRAGMENT_SHADER,t)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(`program link failed: ${e.getProgramInfoLog(r)}`);return r}function i(e,a={}){const t=e.createTexture(),E=a.filter==="nearest"?e.NEAREST:e.LINEAR,r=a.wrap==="repeat"?e.REPEAT:e.CLAMP_TO_EDGE;return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,E),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,E),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,r),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([13,14,16,255])),t}function c(e,a,t){t.readyState<2||(e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t))}export{R as F,i as a,_ as c,c as u};
