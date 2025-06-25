import { threeEnvironment } from './threeEnvironment.js';
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const env = new threeEnvironment(container);

    // --- Box ---
    const box = env.addObject(new THREE.BoxGeometry(20, 20, 20));
    box.mesh.position.set(-60, 0, 0);
    box.setColor('orange');

    box.addEventListener('pointerenter', () => {
        box.setColor('yellow');
        console.log('Box: pointerenter');
    });
    box.addEventListener('transform', () => {
        box.setColor('yellow');
        console.log('Box: transform');
    });
    box.addEventListener('pointerover', () => {
        console.log('Box: pointerover');
    });
    box.addEventListener('pointermove', () => {
        box.mesh.scale.set(1.2, 1.2, 1.2);
        console.log('Box: pointermove');
    });
    box.addEventListener('pointerout', () => {
        box.setColor('orange');
        box.mesh.scale.set(1, 1, 1);
        console.log('Box: pointerout');
    });
    box.addEventListener('pointerdown', () => {
        console.log('Box: pointerdown');
    });
    box.addEventListener('pointerup', () => {
        console.log('Box: pointerup');
    });
    box.addEventListener('dblclick', () => {
        box.setColor('red');
        console.log('Box: dblclick');
    });
    box.addEventListener('contextmenu', () => {
        box.setColor('blue');
        console.log('Box: contextmenu');
    });
    box.addEventListener('wheel', () => {
        box.setColor('green');
        console.log('Box: wheel');
    });
    box.addEventListener('dragstart', () => {
        console.log('Box: dragstart');
    });
    box.addEventListener('drag', () => {
        box.mesh.rotation.y += 0.05;
        console.log('Box: drag');
    });
    box.addEventListener('dragend', () => {
        console.log('Box: dragend');
    });

    // --- Sphere ---
    const sphere = env.addObject(new THREE.SphereGeometry(12, 32, 32));
    sphere.mesh.position.set(-20, 0, 0);
    sphere.setColor('cyan');

    sphere.addEventListener('pointerenter', () => {
        sphere.setColor('yellow');
        console.log('Sphere: pointerenter');
    });
    sphere.addEventListener('pointerout', () => {
        sphere.setColor('cyan');
        console.log('Sphere: pointerout');
    });
    sphere.addEventListener('drag', () => {
        // sphere.mesh.rotation.x += 0.05;
        // sphere.mesh.rotation.y += 0.05;

        // move the sphere along the x-axis
        sphere.mesh.position.x += 0.1;
        // move the sphere along the y-axis
        sphere.mesh.position.y += 0.1;

        console.log('Sphere: drag');
    });

    // --- Torus ---
    const torus = env.addObject(new THREE.TorusGeometry(10, 4, 16, 100));
    torus.mesh.position.set(20, 0, 0);
    torus.setColor('magenta');

    torus.addEventListener('wheel', () => {
        torus.mesh.scale.multiplyScalar(1.1);
        console.log('Torus: wheel');
    });
    torus.addEventListener('dblclick', () => {
        torus.mesh.scale.set(1, 1, 1);
        console.log('Torus: dblclick reset scale');
    });

    // --- Cone ---
    const cone = env.addObject(new THREE.ConeGeometry(10, 20, 32));
    cone.mesh.position.set(60, 0, 0);
    cone.setColor('lime');

    cone.addEventListener('pointerdown', () => {
        cone.mesh.position.y -= 5;
        console.log('Cone: pointerdown');
    });
    cone.addEventListener('pointerup', () => {
        cone.mesh.position.y += 5;
        console.log('Cone: pointerup');
    });
});
