loader = new FBXLoader( manager );
				loadAsset( params.asset );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setAnimationLoop( animate );
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 100, 0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

				// stats
				stats = new Stats();
				container.appendChild( stats.dom );

				const gui = new GUI();
				gui.add( params, 'asset', assets ).onChange( function ( value ) {

					loadAsset( value );

				} );