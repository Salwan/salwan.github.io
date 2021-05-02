---
layout: post
title: "Introducing Zenithia"
description: "A Direct3D9/Direct3D11 framework written in C/C++ and STL, with Boost bits and pieces."
category: zenithia
tags: [zenithia, cpp, direct3d]
---
{% include JB/setup %}

### What is Zenithia?

Zenithia is a Direct3D 9/11 framework that I'm currently developing using C/C++. The scope of the framework is unknown at the moment as I'm developing it specifically to develop and demonstrate my C/C++ and graphics programming abilities.

### Where is it?

[Here in BitBucket](https://bitbucket.org/Salwan/zenithia-git/src/master/)

### Design philosophy

Zenithia's main objective is to simplify and structure Direct3D API functionality providing a higher polished and practical interface for demos and games.

Overtime I'm planning to write more complex systems in Zenithia like: scenegraph, physics, and scripting.

The basic principles I'm following are:

- KISS (keep it stupidly simple)
- YAGNI (you ain't gonna need it)
- Continuous refactoring

### Tools

- Visual Studio 2010, C/C++
- DirectX SDK/PIX
- NVIDIA Fx Composer 2.5 and HLSL/fx for shader development

### Planned Features

- Direct3D9 pipeline
- Direct3D11 pipeline
- Effects system
- Input system
- Collada parsing support
- Character animation system
- Scenegraph
- Google V8 scripting
- Bullet physics integration
- Multi-threaded resource system
- DirectCompute system
- Audio system

### Demonstration

The following code creates a vertex/index buffer, sets and checks input, creates an effect, then renders all:

~~~~ cpp
#include <Zenithia.h>

ZManualMesh mesh;
mesh.createSubset();

// Vertex declaration
ZVertexDeclaration& vertex_declaration = mesh.getVertexDeclaration(0);
vertex_declaration.pushElement(::VERTEXDECL_FLOAT4, ::VERTEXDECLUSAGE_POSITION, 0);
vertex_declaration.pushElement(::VERTEXDECL_FLOAT4, ::VERTEXDECLUSAGE_NORMAL, 0);
vertex_declaration.pushElement(::VERTEXDECL_FLOAT2, ::VERTEXDECLUSAGE_TEXCOORD, 0);
vertex_declaration.pushEndElement();

// Vertex buffer
ZVertexBuffer& vertex_buffer = mesh.getVertexBuffer(0);
// Create vertex buffer with 4 vertices
vertex_buffer.create(vertex_declaration, 4);
// Fill vertex buffer with data
vertex_buffer.writeElements<D3DXVECTOR4>(0, vertex_positions_array, 4);
vertex_buffer.writeElements<D3DXVECTOR4>(1, vertex_normals_array, 4);
vertex_buffer.writeElements<D3DXVECTOR2>(2, vertex_texcoords_array, 4);
// or fill all in one call using a vertex array
vertex_buffer.writeVertices(0, vertex_data, 4);

// Index buffer
ZIndexBuffer& index_buffer = mesh.getIndexBuffer(0);
// Create index buffer with 6 indices
index_buffer.create(6);
// Fill index buffer with data
index_buffer.writeIndices(0, index_array, 6);

// Setup Input
ZInput::instance()->mapKeyToAction(select_action_id, KEYBOARD_ENTER, ZINPUT_HIT);
ZInput::instance()->mapKeyToAction(charge_action_id, KEYBOARD_SPACE, ZINPUT_HELD);
ZInput::instance()->mapKeyToAction(exit_action_id, KEYBOARD_ESCAPE, ZINPUT_RELEASED);
// Check for input
ZInput::instance()->process();
if(ZInput::instance()->getActionState(exit_action_id)) {
    // Exit
}

// Effect
ZEffect effect;
effect.loadFromFile("assets/effect.fx");

// Render everything
D3DXMATRIX matViewProjection = matWorld * matView * matProj;
ZTexture diffuse_texture("diffuse_texture.jpg");
// Set shader constants
effect("matViewProjection") = matViewProjection;
effect("texDiffuse") = diffuse_texture;
// framework activates a valid technique
effect.beginTechnique();
while(effect.nextPass()) {
    // draws for each pass in technique
    mesh.drawSubset(d3ddevice, 0);
}
effect.endTechnique();
~~~~
