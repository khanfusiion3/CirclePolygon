const circlePolygon = (m, a, b) => {
  const A = a.shape;
  const B = b.shape;
  const center = B.u.transpose().muli(a.position.sub(b.position));
  let separation = -Number.MAX_VALUE;
  let faceNormal = 0;
  for (let i = 0; i < B.vertices.length; ++i) {
    let s = B.normals[i].dot(center.sub(B.vertices[i]));
    if (s > A.radius) {
      return;
    }
    if (s > separation) {
      separation = s;
      faceNormal = i;
    }
  }
  let v1 = B.vertices[faceNormal];
  let v2 = B.vertices[faceNormal + 1 < B.vertices.length ? faceNormal + 1 : 0];
  if (separation < ImpulseMath.EPSILON) {
    B.u.mul(B.normals[faceNormal], m.normal).negi();
    m.contacts[0] = new Vec2(m.normal).muli(A.radius).addi(a.position);
    m.penetration = A.radius;
    return;
  }
  let dot1 = center.sub(v1).dot(v2.sub(v1));
  let dot2 = center.sub(v2).dot(v1.sub(v2));
  m.penetration = A.radius - separation;
  if (dot1 <= 0) {
    if (center.distanceSq(v1) > A.radius * A.radius) {
      return;
    }
    B.u.muli(m.normal.set(v1).subi(center)).normalize();
    B.u.mul(v1, m.contacts[0] = new Vec2()).addi(b.position);
  } else if (dot2 <= 0) {
    if (center.distanceSq(v2) > A.radius * A.radius) {
      return;
    }
    B.u.muli(m.normal.set(v2).subi(center)).normalize();
    B.u.mul(v2, m.contacts[0] = new Vec2()).addi(b.position);
  } else {
    const n = B.normals[faceNormal];
    if (center.sub(v1).dot(n) > A.radius) {
      return;
    }
    B.u.mul(n, m.normal).negi();
    m.contacts[0] = new Vec2(a.position).addsi(m.normal, A.radius);
  }
};
