<template>
    <div 
        ref="root"
        class="wonderland root"
        @click="onRootClick"
    >

        <canvas
            ref="canvas"
        ></canvas>
        <div
            ref="test"
            class="test"
        ></div>
        <div 
            class="total-score"
            ref="totalScore"
        >
            {{totalScore.toFixed(2)}}
        </div>
        <div 
            class="scores"
        >
            <p
                ref="gravityX"
                class="gravity-x"
            >0.00</p>
            <p
                ref="gravityY"
                class="gravity-y"
            >0.00</p>
            <p
                ref="velocityX"
                class="velocity-x"
            >0.00</p>
            <p
                ref="velocityY"
                class="velocity-y"
            >0.00</p>
            
        </div>
    </div>
</template>

<script>

import * as THREE from "three"
import { forEach } from "lodash"
import Hamer from "hammerjs"
import { TweenMax } from "gsap/TweenMax"
import SoundBlaster from "components/Wonderland/SoundBlaster"
import { mapState } from 'vuex';

const Matter = require("matter-js")

window.Matter = Matter

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

const config = require("data/wonderland.config.json")

const modules = {
    cards: [],
    backgrounds: {},
    matter: {
        planes: {

        }
    },
    size: new THREE.Vector2( 0, 0 ),
    time: new THREE.Vector2( 0, 0 ),
    gyro: new THREE.Vector2( 0, 0 ),
    soundBlaster: new SoundBlaster()
}

export default {
    data () {
        return {
            prevRenderedFrameTime: +new Date(),
        }
    },
    computed: mapState([
        "soundMuted",
        "mainThemePlays",
        "bumpmappingEnabled",
        "bumpmappingLevel",
        "lightsDistance",
        "lightsIntensity",
        "lightAColor",
        "lightBColor",
        "gyroGravityEnabled",
        "physicEnabled",
        "gravityX",
        "gravityY",
        "matterObjectsFriction",
        "matterObjectsRestitution",
        "matterObjectsFrictionAir",
        "backgroundEnabled",
        "backgroundShader",
        "totalScore",
        "shadowsEnabled"
    ]),
    watch: {
        shadowsEnabled ( enabled ) {
            this.setShadowsEnabled( enabled )
        },
        mainThemePlays ( plays ) {
            if ( plays ) {
                modules.soundBlaster.play( "main_theme", 0.333, true )
            } else {
                modules.soundBlaster.stop( "main_theme" )
            }
        },
        soundMuted ( muted ) {
            modules.soundBlaster.mute( muted )
            this.$store.dispatch( "save" )
        },
        backgroundEnabled ( enabled ) {
            modules.bg.visible = enabled
        },
        backgroundShader ( shader ) {
            this.setBackgroundShader( shader )
        },
        matterObjectsFriction ( value ) {
            forEach ( modules.cards, ( card )=>{
                card.matterBody.friction = value
            } )
        },
        matterObjectsFrictionAir ( value ) {
            forEach ( modules.cards, ( card )=>{
                card.matterBody.frictionAir = value
            } )
        },
        matterObjectsRestitution ( value ) {
            forEach ( modules.cards, ( card )=>{
                card.matterBody.restitution = value
            } )
        },
        gravityX ( value ) {
            // this.$store.state.gyroGravityEnabled = false
            modules.matter.engine.world.gravity.x = value
        },
        gravityY ( value ) {
            // this.$store.state.gyroGravityEnabled = false
            modules.matter.engine.world.gravity.y = value
        },
        physicEnabled ( enabled ) {
            this.prevRenderedFrameTime = +new Date()
        },
        gyroGravityEnabled ( enabled ) {
            if ( !enabled ) {
                this.$store.state.gravityX = 0
                this.$store.state.gravityY = 0
            }
        },
        lightAColor ( color ) {
            this.setLightColor( "A", color )
        },
        lightBColor ( color ) {
            this.setLightColor( "B", color )
        },
        lightsIntensity ( value ) {
            modules.pointLightA.intensity = value
            modules.pointLightB.intensity = value
            this.renderFrame()
        },
        lightsDistance ( value ) {
            value /= 1000
            modules.lightGroup.position.z = modules.camera.position.z * value
            this.renderFrame()
        },
        bumpmappingLevel ( value ) {
            forEach ( modules.cards, ( card )=>{
                card.material.bumpScale = value
                card.material.needsUpdate = true;
            } )

            this.renderFrame()
        },
        bumpmappingEnabled ( enabled ) {
            forEach ( modules.cards, ( card )=>{
                if (enabled){
                    card.material.bumpMap = card.material.bumpMap || card.$bumpMap
                } else {
                    card.$bumpMap = card.$bumpMap || card.material.bumpMap
                    card.material.bumpMap = null
                }

                card.material.needsUpdate = true;
            } )

            this.renderFrame()
        },
        totalScore: function(){
            if ( this.scoreTween ) {
                this.scoreTween.kill()
                delete this.scoreTween
            }

            this.scoreTween = TweenMax.fromTo( this.$refs.totalScore, 0.1, {
                 transform: "scale(1, 1)"
            }, {
                transform: "scale(2, 2)",
                yoyo: true,
                repeat: 1,
                onComplete: ()=>{
                    delete this.scoreTween
                }
            } )
        }
    },
	mounted () {

        window.wonder = this

		this.setupRenderer()
        
        this.updateSize()
        this.setupMatterEngine()
        this.$createBackgrounds()
        this.$addBackground()

        this.$addTestObject()

        this.setupGestures()
        this.setupGyro()


        this.modules = modules

        window.addEventListener( "resize", ()=> this.updateSize() )
        window.addEventListener( "orientationchange", ()=> this.updateSize() )

        this.updateSize()
        this.startRendering()

        this.$root.$on( "wonderland.render", ()=> this.startRendering() )

        if ( this.$store.state.isHybridApp ) {
            this.$store.state.mainThemePlays = true
        }

        this.setShadowsEnabled( this.$store.state.shadowsEnabled )
        modules.soundBlaster.mute( this.$store.state.soundMuted )

	},
    methods: {
        $addTestObject () {
            forEach( config.cardTextures, ( data, name )=>{
                let texture = new THREE.TextureLoader().load( data.texture );
                let bumpMap = new THREE.TextureLoader().load( data.bumpmap );

                for ( let a = 0; a < data.count; a++ ) {
                    let height = (Math.min(modules.size.x, modules.size.y) / ( 4 + ( Math.floor( Math.random() * 4 ) ) ) )
                    let width = height * data.aspect

                    let x = modules.size.x / 2
                    let y = modules.size.y / 2

                    let geometry

                    if ( data.geometry == "circle" ) {
                        geometry = new THREE.CircleBufferGeometry( height / 2,  data.segments || 32)
                    } else if (data.geometry == "ring") {
                        geometry = new THREE.RingBufferGeometry( height / 3, height / 2, data.segments || 32)
                    } else if (data.geometry == "sphere"){
                        geometry = new THREE.SphereBufferGeometry( (height / 2) * 0.85, data.segments || 32, data.segments || 32)
                    } else if (data.geometry == "box"){
                        geometry = new THREE.BoxBufferGeometry( height * 0.8, height * 0.8, height * 0.8)
                    } else {
                        geometry = new THREE.PlaneBufferGeometry( width, height, 1)
                    }

                    // geometry.translate( height / 2, width / 2, 0 )
                    let material = new THREE.MeshPhongMaterial( { 
                        color: 0xffffff, 
                        map: texture, 
                        transparent: true,
                        // side: THREE.DoubleSide,
                        depthTest: false
                    })

                    material.transparent = true

                    material.bumpMap = bumpMap
                    material.bumpScale = config.bumpScale || 1

                    let card = new THREE.Mesh ( geometry, material )

                    TweenMax.fromTo( card.rotation, Math.floor(4 + Math.random() * 5), {
                        y: -Math.PI / 32,
                        x: Math.PI / 32,
                    }, {
                        y: Math.PI / 32,
                        x: -Math.PI / 32,
                        repeat: -1,
                        ease: Back.easeInOut.config(1.7),
                        yoyo: true
                    } )

                    modules.scene.add( card )

                    modules.cards.push( card )

                    
                    let matterBody

                    if ( data.geometry == "circle" || data.geometry == "ring" || data.geometry == "sphere") {
                        matterBody = Bodies.circle(x, y, height / 2 );
                    } else {
                        matterBody = Bodies.rectangle(x, y, width, height );
                    }


                    Matter.Body.setAngle( matterBody, Math.random() * Math.PI * 2 )

                    Matter.Body.setMass( matterBody, data.mass || Math.pow( width, 1 ) )

                    matterBody.friction = this.$store.state.matterObjectsFriction;
                    matterBody.frictionAir = this.$store.state.matterObjectsFrictionAir;
                    matterBody.restitution = this.$store.state.matterObjectsRestitution;

                    card.matterBody = matterBody

                    World.add(modules.matter.engine.world, [ matterBody ]); 
                }
            } )
        },
        $createBackgrounds () {
            forEach( config.backgrounds, ( data, name )=>{
                let vertShader = require( "raw-loader!shaders/bg.vert" ).default
                let fragShader = require( `raw-loader!shaders/${data.shader}` ).default
                // geometry.translate( height / 2, width / 2, 0 )

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

                modules.backgrounds[ name ] = material
            } )
        },
        setBackgroundShader ( name ) {
            if ( !modules.backgrounds[ name ] ) name = "stars"

            let material = modules.backgrounds[ name ]
            modules.bg.material = material
            this.renderFrame()
        },
        setShadowsEnabled ( enabled ) {
            let renderer = modules.renderer
            let lightA = modules.pointLightA
            let lightB = modules.pointLightB
            let scene = modules.scene
            let shadowBg = modules.shadowBg

            if ( enabled ) {
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

                //Create a PointLight and turn on shadows for the light
                lightA.castShadow = true;            // default false
                // lightB.castShadow = true;            // default false

                //Set up shadow properties for the light
                lightA.shadow.mapSize.width = 512;  // default
                lightA.shadow.mapSize.height = 512; // default
                lightA.shadow.camera.near = 0.01;       // default
                lightA.shadow.camera.far = 10000      // default

                lightB.shadow.mapSize.width = 512;  // default
                lightB.shadow.mapSize.height = 512; // default
                lightB.shadow.camera.near = 0.01;       // default
                lightB.shadow.camera.far = 10000      // default

                //Create a sphere that cast shadows (but does not receive them)
                // var sphereGeometry = new THREE.SphereBufferGeometry( 5, 32, 32 );
                // var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
                // var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
                // sphere.castShadow = true; //default is false
                // sphere.receiveShadow = false; //default
                // scene.add( sphere );

                forEach( modules.cards, ( card )=>{
                    card.castShadow = true
                    card.receiveShadow = false
                } )

                //Create a plane that receives shadows (but does not cast them)
                // var planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
                // var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
                // var plane = new THREE.Mesh( planeGeometry, planeMaterial );
                shadowBg.receiveShadow = true;
                // scene.add( plane );

                //Create a helper for the shadow camera (optional)
            } else {

            }
        },
        $addBackground () {
            let self = this

            let vertShader = require( "raw-loader!shaders/bg.vert" ).default
            let fragShader = require( "raw-loader!shaders/stars.frag" ).default
            // let fragShader = require( "raw-loader!shaders/helix.frag" ).default

            let geometry = new THREE.PlaneGeometry( 1, 1, 1)
            // geometry.translate( height / 2, width / 2, 0 )

            let bg = new THREE.Mesh ( geometry )
            modules.bg = bg

            this.setBackgroundShader( this.$store.state.backgroundShader )

            modules.scene.add(bg)

            // let shadowBg = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( {
            //     // color: 0xffffff,
            //     transparent: true
            // } ) )

            // shadowBg.scale.set(10000, 10000, 10000)
            // shadowBg.position.z = -100
            // // shadowBg.position.set(5000, 5000, 5000)

            // modules.shadowBg = shadowBg

            // modules.scene.add( shadowBg )
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
                this.$store.dispatch( "checkFullscreen" )

                if ( !this.mainThemePlays && !this.$store.state.isHybridApp ) {
                    this.$store.state.mainThemePlays = true
                }

                e.preventDefault()
                this.setVelocity( e.overallVelocityX * config.velocityMultiplier * window.devicePixelRatio, e.overallVelocityY * config.velocityMultiplier * window.devicePixelRatio )
            });

        },
        setupGyro () {
            window.addEventListener('deviceorientation', ( event )=> {
               if ( !modules.matter.engine ) return

               if ( this.gyroGravityEnabled ) {
                   let alpha = Math.floor(event.alpha)
                   let beta  = Math.floor(event.beta)
                   let gamma = Math.floor(event.gamma)

                   let newGravityX = gamma * config.gravityMultiplier
                   let newGravityY = beta * config.gravityMultiplier

                   // console.log(alpha, beta, gamma)

                   modules.gyro.set( newGravityX, newGravityY  )

                   if (newGravityX == 0 && newGravityY == 0) {
                       return
                   }

                   if (newGravityX > 1) newGravityX = 1
                   if (newGravityY > 1) newGravityY = 1

                   if (newGravityX < -1) newGravityX = -1
                   if (newGravityY < -1) newGravityY = -1

                   modules.matter.engine.world.gravity.x = (newGravityX)
                   modules.matter.engine.world.gravity.y = (newGravityY)
                   // this.$store.state.gravityX = (newGravityX)
                   // this.$store.state.gravityY = (newGravityY)



                   this.$refs.gravityX.textContent = newGravityX.toFixed(2)
                   this.$refs.gravityY.textContent = newGravityY.toFixed(2)
               }


            });

            // window.addEventListener('devicemotion', ( event )=> {
            //     let ax = Math.floor( event.acceleration.x )
            //     let ay = Math.floor( event.acceleration.y )

            //     this.setVelocity(ax, ay)


            // });

            // window.addEventListener('compassneedscalibration', function(event) {
            // });
        },  
        setupRenderer () {
            let canvasElement = this.$refs.canvas


            let scene = new THREE.Scene()
            let camera = new THREE.PerspectiveCamera( config.cameraFOV, window.innerWidth / window.innerHeight, 0.001, 100000 )
            let renderer = new THREE.WebGLRenderer({ 
                antialias: false, 
                canvas: canvasElement,
            })

            let lightGroup = new THREE.Group()

            let pointLightA = new THREE.PointLight( 0xF64272, 1, 100000 );
            pointLightA.intensity = 1.7;
            pointLightA.position.y = -250

            let pointLightB = new THREE.PointLight( 0x51e5db, 1, 100000 );
            pointLightB.intensity = 1.7;
            pointLightB.position.y = 250


            // TweenMax.to( pointLightA, 6, {
            //     intensity: 1.4,
            //     repeat: -1,
            //     yoyo: true,
            //     ease: Back.easeInOut.config(1.3),
            // } )

            TweenMax.fromTo( pointLightA.position, 3, {
                x: -150
            }, {
                x: 150,
                repeat: -1,
                yoyo: true,
                ease: Back.easeInOut.config(1.3),
            } )

            TweenMax.fromTo( pointLightB.position, 5, {
                x: -150
            }, {
                x: 150,
                repeat: -1,
                yoyo: true,
                ease: Back.easeInOut.config(1.3),
            } )

            lightGroup.add( pointLightA )
            lightGroup.add( pointLightB )

            scene.add(lightGroup)

            renderer.setClearColor(0x000000)            

            modules.scene = scene
            modules.camera = camera
            modules.renderer = renderer
            modules.lightGroup = lightGroup
            modules.pointLightA = pointLightA
            modules.pointLightB = pointLightB

            this.setLightColor( "A", this.$store.state.lightAColor )
            this.setLightColor( "B", this.$store.state.lightBColor )


            setInterval( ()=>{
                modules.time.x += 0.01
                modules.time.x = modules.time.x % 10
            }, 1000 / 30 )
        },
        setupMatterEngine () {
            
            // create an engine
            var engine = Engine.create();
            let size = modules.size

            var leftPlane = Bodies.rectangle(-(config.boxWallThickness / 2), size.y / 2, config.boxWallThickness, size.y, { isStatic: true });
            var rightPlane = Bodies.rectangle(size.x + (config.boxWallThickness / 2), size.y / 2, config.boxWallThickness, size.y, { isStatic: true });
            var topPlane = Bodies.rectangle(size.x / 2, -(config.boxWallThickness / 2), size.x, config.boxWallThickness, { isStatic: true });
            var bottomPlane = Bodies.rectangle(size.x / 2, size.y + (config.boxWallThickness / 2), size.x, config.boxWallThickness, { isStatic: true });

            // add all of the bodies to the world
            World.add(engine.world, [ leftPlane, rightPlane, topPlane, bottomPlane ]);

            modules.matter.planes.left = leftPlane
            modules.matter.planes.right = rightPlane
            modules.matter.planes.top = topPlane
            modules.matter.planes.bottom = bottomPlane
            // run the engine
            modules.matter.engine = engine

            modules.matter.engine.world.gravity.x = this.$store.state.gravityX
            modules.matter.engine.world.gravity.y = this.$store.state.gravityY
            // modules.matter.render = render
        
            // run the renderer
        },
        setLightColor ( lightId, color ) {
            color = parseInt( color.substring(1), 16 )
            modules[`pointLight${lightId}`].color.setHex(color)

            this.renderFrame()
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

            // add all of the bodies to the world
            World.add(modules.matter.engine.world, [ leftPlane, rightPlane, topPlane, bottomPlane ]);

            modules.matter.planes.left = leftPlane
            modules.matter.planes.right = rightPlane
            modules.matter.planes.top = topPlane
            modules.matter.planes.bottom = bottomPlane
        },
        startRendering () {
            this.prevRenderedFrameTime = +new Date()
            this.renderingActive = true
            // modules.matter.runner = Engine.run(modules.matter.engine);
            this.render()
        },
        render () {
            let now = +new Date()
            let delta = now - this.prevRenderedFrameTime

            if ( delta > 100 ) delta = 100

            this.prevRenderedFrameTime = now

            this.rafId = requestAnimationFrame( ()=> this.render() )

            this.updateThings( delta || 0 )
            this.renderFrame( delta )
        },
        renderFrame ( ) {
            modules.renderer.render( modules.scene, modules.camera )
        },
        stopRendering () {
            this.renderingActive = false
            // Matter.Runner.stop( modules.matter.runner )
            cancelAnimationFrame( this.rafId )
        },
        updateSize () {
            let canvasElement = this.$refs.canvas
            let canvasParentElement = canvasElement.parentElement

            if ( canvasParentElement ) {
                let rect = canvasParentElement.getBoundingClientRect()

                let width = rect.width * window.devicePixelRatio
                let height = rect.height * window.devicePixelRatio

                modules.camera.aspect = width/ height
                modules.camera.position.x = modules.lightGroup.position.x = width / 2
                modules.camera.position.y = modules.lightGroup.position.y = -height / 2
                modules.camera.position.z = modules.lightGroup.position.z = ( ( Math.sqrt( 3 ) / 2 ) * height )

                modules.lightGroup.position.z *= ( this.$store.state.lightsDistance / 1000 );

                modules.pointLightA.position.y = -height / 2
                modules.pointLightB.position.y = height / 2

                modules.size.x = width
                modules.size.y = height

                this.updateMatterPlanes()

                modules.camera.updateProjectionMatrix()
                modules.renderer.setSize( width, height )
            }
        },
        setVelocity ( x, y ) {

            if (x > config.maxVelocity) x = config.maxVelocity
            if (x < -config.maxVelocity) x = -config.maxVelocity

            if (y > config.maxVelocity) y = config.maxVelocity
            if (y < -config.maxVelocity) y = -config.maxVelocity

            this.$refs.velocityX.textContent = x.toFixed(2)
            this.$refs.velocityY.textContent = y.toFixed(2)

            forEach( modules.cards, ( card )=>{
                Matter.Body.setVelocity( card.matterBody, { x: x, y: y });
            } )
        },
        updateThings ( delta ) {
            
            if ( this.physicEnabled ) {
                Matter.Engine.update( modules.matter.engine, delta )
            }

            // Render.run(modules.matter.render);
            
            // modules.cards.kek.rotation.z+=0.001


            for ( var a = 0; a < modules.cards.length; a++ ) {

                // Matter.Body.setPosition(body, {
                //     x : body.position.x + delta.x,
                //     y : body.position.y + delta.y,
                // });

                if (modules.cards[a].matterBody.position.x > modules.size.x * 2) {
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.x)
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.y)

                    Matter.Body.setPosition( modules.cards[a].matterBody, { x: 0, y: 0 } )
                }

                if (modules.cards[a].matterBody.position.x > modules.size.y * 2) {
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.x)
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.y)

                    Matter.Body.setPosition( modules.cards[a].matterBody, { x: 0, y: 0 } )
                }

                if (modules.cards[a].matterBody.position.x < -modules.size.x ) {
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.x)
                    this.$store.state.totalScore += Math.abs(modules.cards[a].matterBody.velocity.y)
                    Matter.Body.setPosition( modules.cards[a].matterBody, { x: modules.size.x, y: 0 } )
                }

                modules.cards[a].position.x = modules.cards[a].matterBody.position.x
                modules.cards[a].position.y = -modules.cards[a].matterBody.position.y

                modules.cards[a].rotation.z = -modules.cards[a].matterBody.angle
            }
        },
        onPauseClick ( evt ) {
            this.$store.dispatch( "checkFullscreen" )
            evt.stopPropagation()
            this.$emit( "pauseClick" )
        },
        onRootClick ( evt ) {

            if ( !this.mainThemePlays && !this.$store.state.isHybridApp ) {
                this.$store.state.mainThemePlays = true
            }

            // try {
            //     document.body.webkitRequestFullscreen()

            // } catch ( err ) {}

            let x = evt.pageX
            let y = evt.pageY

            let object = this.detectIntersection( x * window.devicePixelRatio, y * window.devicePixelRatio )


            if ( object && this.physicEnabled ) {

                let currentState = object.$sizeState 

                if ( typeof currentState != "number" ) {
                    currentState = object.$sizeState = 2
                }

                currentState++

                if ( currentState > config.scaleLevels.length - 1 ) currentState = 0


                let scaleLevel = config.scaleLevels[ currentState ]

                object.$sizeState = currentState

                let scaleX = object.scale.x
                let scaleY = object.scale.y
                let scaleZ = object.scale.z

                if ( object.__renderScaleTween ) {
                    object.__renderScaleTween.kill()
                    delete object.__renderScaleTween
                }

                object.__renderScaleTween = TweenMax.to(object.scale, 0.1, {
                    x: scaleLevel,
                    y: scaleLevel,
                    z: scaleLevel,
                    ease: "easeInOut",
                    onComplete: ()=>{
                        delete object.__renderScaleTween
                    }
                })

                console.log(scaleLevel)

                Matter.Body.scale( object.matterBody, 1/scaleX, 1/scaleY )
                Matter.Body.scale( object.matterBody, scaleLevel, scaleLevel )

                // let target = {  x: scaleX, y: scaleY, z: scaleZ }

                // object.__matterScaleTween = TweenMax.to( target, 0.222, {
                //     ease: "easeInOut",
                //     x: scaleLevel,
                //     y: scaleLevel,
                //     z: scaleLevel,
                //     onUpdate: ()=>{
                //         Matter.Body.scale( object.matterBody, target.x, target.y )
                //         // Matter.Body.setVelocity(  object.matterBody, 0 )
                //     }
                // } )
            }

        },
        detectIntersection ( x, y ) {

            let result = null

            forEach( modules.cards, ( card, index )=>{
                let bounds = card.matterBody.bounds


                if ( x > bounds.min.x && x < bounds.max.x && y > bounds.min.y && y < bounds.max.y ) {
                    result = card
                }

            } )

            return result
        }
    }

}
   
</script>

<style lang="sass">

</style>