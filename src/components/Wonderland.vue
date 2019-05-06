<template>
    <div 
        ref="root"
        class="wonderland root"
    >

        <canvas
            ref="canvas"
        ></canvas>
        <div
            ref="test"
            class="test"
        ></div>
    </div>
</template>

<script>

import * as THREE from "three"
import { forEach } from "lodash"
import Hamer from "hammerjs"

const Matter = require("matter-js")

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const config = {
    velocityMultiplier: 20,
    gravityMultiplier: 0.2,
    cameraFOV: 60
}

const modules = {
    cards: [],
    matter: {
        planes: {

        }
    },
    size: new THREE.Vector2( 0, 0 ),
    time: new THREE.Vector2( 0, 0 ),
    gyro: new THREE.Vector2( 0, 0 )
}

export default {
    data () {
        return {
            
        }
    },
	mounted () {
        console.log(Hammer)

        window.wonder = this

		this.setupRenderer()
        
        this.updateSize()
        this.setupMatterEngine()
        this.$addBackground()
        this.$addTestObject()

        this.setupGestures()
        this.setupGyro()


        this.modules = modules

        window.addEventListener( "resize", ()=> this.updateSize() )
        window.addEventListener( "orientationchange", ()=> this.updateSize() )

        this.updateSize()
        this.render()

	},
    methods: {
        $addTestObject () {
            var texture = new THREE.TextureLoader().load( 'res/pics/Sloppy_Dolly.png' );

            for ( let a = 0; a < 16; a++ ) {
                let height = (modules.size.y / 5) / ( Math.floor( 1 + Math.random() * 3 ) )
                let width = height * 5 / 7

                let x = modules.size.x * Math.random() / 2 + modules.size.x / 4
                let y = modules.size.y * Math.random() / 2 + modules.size.y / 4

                let geometry = new THREE.PlaneGeometry( width, height, 1)
                // geometry.translate( height / 2, width / 2, 0 )
                let material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, transparent: true })
                let card = new THREE.Mesh ( geometry, material )

                modules.scene.add( card )

                modules.cards[a] = card

                let matterBody = Bodies.rectangle(x, y, width, height );
                Matter.Body.setAngle( matterBody, Math.random() * Math.PI * 2 )

                Matter.Body.setMass( matterBody, Math.pow( width, 2 ) )
                card.matterBody = matterBody

                World.add(modules.matter.engine.world, [ matterBody ]); 
            }

        },
        $addBackground () {
            let self = this

            let vertShader = require( "raw-loader!shaders/bg.vert" ).default
            let fragShader = require( "raw-loader!shaders/bg.frag" ).default

            let geometry = new THREE.PlaneGeometry( 1, 1, 1)
            // geometry.translate( height / 2, width / 2, 0 )

            console.log(modules.time)
            let material = new THREE.ShaderMaterial( {
                vertexShader: vertShader,
                fragmentShader: fragShader,
                transparent: true,
                uniforms: {
                    resolution: {
                        value: modules.size
                    },
                    time: {
                        get value () {
                            return modules.time.x
                        }
                    },
                    gyro: {
                        value: modules.gyro
                    }
                }
            } )

            console.log(material, modules.time)

            let bg = new THREE.Mesh ( geometry, material )

            modules.scene.add(bg)
        },
        setupGestures () {
            // Create an instance of Hammer with the reference.
            var manager = new Hammer.Manager( this.$refs.root );

            // Create a recognizer
            var Swipe = new Hammer.Swipe();

            // Add the recognizer to the manager
            manager.add(Swipe);

            // Declare global variables to swiped correct distance
            var deltaX = 0;
            var deltaY = 0;

            // Subscribe to a desired event
            manager.on('swipe', (e)=>{
                this.setVelocity( e.overallVelocityX * config.velocityMultiplier * window.devicePixelRatio, e.overallVelocityY * config.velocityMultiplier * window.devicePixelRatio )
            });

        },
        setupGyro () {
            window.addEventListener('deviceorientation', ( event )=> {
               if ( !modules.matter.engine ) return

               let alpha = Math.floor(event.alpha)
               let beta  = Math.floor(event.beta)
               let gamma = Math.floor(event.gamma)

               let newGravityX = beta * config.gravityMultiplier
               let newGravityY = gamma * config.gravityMultiplier

               modules.gyro.set( newGravityX, newGravityY  )

               if (newGravityX == 0 && newGravityY == 0) {
                   return
               }

               modules.matter.engine.world.gravity.y = (newGravityX)
               modules.matter.engine.world.gravity.x = (newGravityY)


               // console.log(alpha, beta, gamma)
            });

            // window.addEventListener('devicemotion', ( event )=> {
            //     let ax = Math.floor( event.acceleration.x )
            //     let ay = Math.floor( event.acceleration.y )

            //     console.log(ax, ay)


            // });

            // window.addEventListener('compassneedscalibration', function(event) {
            //    console.log(event)
            // });
        },  
        setupRenderer () {
            let canvasElement = this.$refs.canvas

            console.log(canvasElement)

            let scene = new THREE.Scene()
            let camera = new THREE.PerspectiveCamera( config.cameraFOV, window.innerWidth / window.innerHeight, 0.1, 10000 )
            let renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                canvas: canvasElement,
            })

            let pointLight = new THREE.PointLight( 0xb7ffff, 1, 100000 );
            pointLight.intensity = 2;

            scene.add(pointLight)

            renderer.setClearColor(0x000000)            

            modules.scene = scene
            modules.camera = camera
            modules.renderer = renderer
            modules.pointLight = pointLight

            setInterval( ()=>{
                modules.time.x += 0.005
                modules.time.x = modules.time.x % 10
            }, 1000 / 30 )
        },
        setupMatterEngine () {
            
            // create an engine
            var engine = Engine.create();
            let size = modules.size

            var leftPlane = Bodies.rectangle(-100, size.y / 2, 200, size.y, { isStatic: true });
            var rightPlane = Bodies.rectangle(size.x + 100, size.y / 2, 200, size.y, { isStatic: true });
            var topPlane = Bodies.rectangle(size.x / 2, -100, size.x, 200, { isStatic: true });
            var bottomPlane = Bodies.rectangle(size.x / 2, size.y + 100, size.x, 200, { isStatic: true });

            // add all of the bodies to the world
            World.add(engine.world, [ leftPlane, rightPlane, topPlane, bottomPlane ]);

            modules.matter.planes.left = leftPlane
            modules.matter.planes.right = rightPlane
            modules.matter.planes.top = topPlane
            modules.matter.planes.bottom = bottomPlane
            // run the engine
            modules.matter.engine = engine
            // modules.matter.render = render
            Engine.run(modules.matter.engine);
            // run the renderer
        },
        updateMatterPlanes () {
           
            if (!modules.matter.engine) return

            let size = modules.size

            Matter.Composite.remove(modules.matter.engine.world, modules.matter.planes.left)
            Matter.Composite.remove(modules.matter.engine.world, modules.matter.planes.right)
            Matter.Composite.remove(modules.matter.engine.world, modules.matter.planes.top)
            Matter.Composite.remove(modules.matter.engine.world, modules.matter.planes.bottom)

            var leftPlane = Bodies.rectangle(-100, size.y / 2, 200, size.y, { isStatic: true });
            var rightPlane = Bodies.rectangle(size.x + 100, size.y / 2, 200, size.y, { isStatic: true });
            var topPlane = Bodies.rectangle(size.x / 2, -100, size.x, 200, { isStatic: true });
            var bottomPlane = Bodies.rectangle(size.x / 2, size.y + 100, size.x, 200, { isStatic: true });

            console.log(size)
            // add all of the bodies to the world
            World.add(modules.matter.engine.world, [ leftPlane, rightPlane, topPlane, bottomPlane ]);

            modules.matter.planes.left = leftPlane
            modules.matter.planes.right = rightPlane
            modules.matter.planes.top = topPlane
            modules.matter.planes.bottom = bottomPlane
        },
        render () {
            this.rafId = requestAnimationFrame( ()=> this.render() )

            this.updateThings()

            modules.renderer.render( modules.scene, modules.camera )
        },
        updateSize () {
            let canvasElement = this.$refs.canvas
            let canvasParentElement = canvasElement.parentElement

            if ( canvasParentElement ) {
                let rect = canvasParentElement.getBoundingClientRect()

                let width = rect.width * window.devicePixelRatio
                let height = rect.height * window.devicePixelRatio

                modules.camera.aspect = width/ height
                modules.camera.position.x = modules.pointLight.position.x = width / 2
                modules.camera.position.y = modules.pointLight.position.y = -height / 2
                modules.camera.position.z = modules.pointLight.position.z = ( ( Math.sqrt( 3 ) / 2 ) * Math.max( width, height ) )

                modules.pointLight.position.z *= 0.666;

                modules.size.x = width
                modules.size.y = height

                this.updateMatterPlanes()

                modules.camera.updateProjectionMatrix()
                modules.renderer.setSize( width, height )
            }
        },
        setVelocity ( x, y ) {
            forEach( modules.cards, ( card )=>{
                Matter.Body.setVelocity( card.matterBody, { x: x, y: y });
            } )
        },
        updateThings () {

            // Render.run(modules.matter.render);
            
            // modules.cards.kek.rotation.z+=0.001

            // console.log(modules.cards[0].matterBody.angle)

            for ( var a = 0; a < modules.cards.length; a++ ) {

                // Matter.Body.setPosition(body, {
                //     x : body.position.x + delta.x,
                //     y : body.position.y + delta.y,
                // });

                modules.cards[a].position.x = modules.cards[a].matterBody.position.x
                modules.cards[a].position.y = -modules.cards[a].matterBody.position.y

                modules.cards[a].rotation.z = -modules.cards[a].matterBody.angle
            }
        }
    }

}
   
</script>

<style lang="sass">

</style>