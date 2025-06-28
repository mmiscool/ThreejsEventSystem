import { threeEnvironment } from './threeEnvironment.js';
import * as THREE from 'three';


window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const env = new threeEnvironment(container);
    window.env = env; // Expose env to the global scope for debugging

    // --- Box ---
    // const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    // console.log('BoxGeometry:', boxGeometry);
    // const box = env.addObject(boxGeometry);
    // box.name = "myBox"; // Set a name for the box object
    // box.controls = false; // Disable controls for this object
    // console.log('Box:', box);
    // box.position.set(-60, 0, 0);
    // box.setColor('orange');

    // box.addEventListener('pointerenter', () => {
    //     box.setColor('yellow');
    //     console.log('Box: pointerenter');
    // });
    // box.addEventListener('transform', () => {
    //     box.setColor('yellow');
    //     console.log('Box: transform');
    // });
    // box.addEventListener('pointerover', () => {
    //     console.log('Box: pointerover');
    // });
    // box.addEventListener('pointermove', () => {
    //     box.scale.set(1.2, 1.2, 1.2);
    //     console.log('Box: pointermove');
    // });
    // box.addEventListener('pointerout', () => {
    //     box.setColor('orange');
    //     box.scale.set(1, 1, 1);
    //     console.log('Box: pointerout');
    // });
    // box.addEventListener('pointerdown', () => {
    //     console.log('Box: pointerdown');
    // });
    // box.addEventListener('contextmenu', () => {
    //     console.log('Box: pointerup');
    //     box.transformControls.mode = box.transformControls.mode === 'translate' ? 'rotate' : 'translate';
    // });
    // box.addEventListener('dblclick', () => {
    //     box.setColor('red');
    //     console.log('Box: dblclick');
    //     //alert(`box name: ${box.name}`); // Show box name in an alert
    //     //alert(`box controls: ${box.controls}`); // Show controls state in an alert
    //     box.controls = !box.controls; // Toggle controls on double click

    // });
    // box.addEventListener('contextmenu', () => {
    //     box.setColor('blue');
    //     console.log('Box: contextmenu');
    // });
    // box.addEventListener('wheel', () => {
    //     box.setColor('green');
    //     console.log('Box: wheel');
    // });
    // box.addEventListener('dragstart', () => {
    //     console.log('Box: dragstart');
    // });
    // box.addEventListener('drag', () => {
    //     box.rotation.y += 0.05;
    //     console.log('Box: drag');
    // });
    // box.addEventListener('dragend', () => {
    //     console.log('Box: dragend');
    // });

    // // --- Sphere ---
    // const sphere = env.addObject(new THREE.SphereGeometry(12, 32, 32));
    // sphere.position.set(-20, 0, 0);
    // sphere.setColor('cyan');

    // sphere.addEventListener('pointerenter', () => {
    //     sphere.setColor('yellow');
    //     console.log('Sphere: pointerenter');
    // });
    // sphere.addEventListener('pointerout', () => {
    //     sphere.setColor('cyan');
    //     console.log('Sphere: pointerout');
    // });
    // sphere.addEventListener('drag', () => {
    //     // sphere.rotation.x += 0.05;
    //     // sphere.rotation.y += 0.05;

    //     // move the sphere along the x-axis
    //     sphere.position.x += 0.1;
    //     // move the sphere along the y-axis
    //     sphere.position.y += 0.1;

    //     console.log('Sphere: drag');
    // });

    // --- Torus ---
    const torus = env.addObject(new THREE.TorusGeometry(10, 4, 16, 100));
    torus.position.set(20, 0, 0);
    torus.setColor('magenta');

    torus.addEventListener('wheel', () => {
        torus.scale.multiplyScalar(1.1);
        console.log('Torus: wheel');
    });
    torus.addEventListener('dblclick', () => {
        torus.scale.set(1, 1, 1);
        console.log('Torus: dblclick reset scale');
    });


    torus.addEventListener('pointerenter', () => {
        torus.setColor('yellow');
        console.log('Point: pointerenter');
    });
    torus.addEventListener('pointerout', () => {
        torus.setColor('red');
        console.log('Point: pointerout');
    });



    // --- Cone ---
    // const cone = env.addObject(new THREE.ConeGeometry(10, 20, 32));
    // cone.position.set(60, 0, 0);
    // cone.setColor('lime');

    // cone.addEventListener('pointerdown', () => {
    //     cone.position.y -= 5;
    //     console.log('Cone: pointerdown');
    // });
    // cone.addEventListener('pointerup', () => {
    //     cone.position.y += 5;
    //     console.log('Cone: pointerup');
    // });



    // make a three.vector3 object to represent a point in 3D space
    const point = env.addObject(new THREE.Vector3(10, 10, 10));
    point.setColor('red'); // Set color for the point
    // set color to red when pointer is over the point and reset to original color when pointer leaves
    point.addEventListener('pointerenter', () => {
        point.setColor('yellow');
        console.log('Point: pointerenter');
    });
    point.addEventListener('pointerout', () => {
        point.setColor('red');
        console.log('Point: pointerout');
    });



    // change color to green when point is clicked
    point.addEventListener('pointerdown', () => {
        point.setColor('green');
        console.log('Point: pointerdown');
    });

    point.controls = false; // Disable controls for this point
});
