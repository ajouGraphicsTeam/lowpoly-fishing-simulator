function quad(a, b, c, d) {
    a = a + lightingStartOffset;
    b = b + lightingStartOffset;
    c = c + lightingStartOffset;
    d = d + lightingStartOffset;  
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    pointsArray.push(vertices[d]);
    normalsArray.push(normal);
    numQuad++; // for auto-calculatation of the numVertices
}   

function tri(a, b, c) {
    a = a + lightingStartOffset;
    b = b + lightingStartOffset;
    c = c + lightingStartOffset;
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);
    pointsArray.push(vertices[a]);
    normalsArray.push(normal);
    pointsArray.push(vertices[b]);
    normalsArray.push(normal);
    pointsArray.push(vertices[c]);
    normalsArray.push(normal);
    numTri++; // for auto-calculatation of the numVertices
}


// can lighting the opposite side by just calling rev functions below.
// maybe can make side functions by utilizing them
function revQuad(a, b, c, d) {
    quad(c, b, a, d); 
}   

function revTri(a, b, c) {
    tri(c, b, a);
}

