import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { useRef, useEffect, useState, useMemo, MutableRefObject } from 'react'
import { useFrame, useLoader, extend, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, MeshDistortMaterial } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GlobalCanvas, ViewportScrollScene, ScrollScene, UseCanvas, SmoothScrollbar, useTracker, useScrollRig, useImageAsTexture, styles } from '@14islands/r3f-scroll-rig'
import { PivotControls, MeshTransmissionMaterial, Grid, Environment, PerspectiveCamera, CameraControls, Text, Text3D, useTexture, useProgress, Box, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'
// @ts-ignore
import { Model } from '../components/Untitled'
// @ts-ignore
import { Diamond } from '../components/Diamond'
// @ts-ignore
import { Sphere } from '../components/Sphere'
// @ts-ignore
import myFont from '../assets/fonts/XYBER_Regular.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import '@14islands/r3f-scroll-rig/css'
// @ts-ignore
import { useTrackerMotionValue } from '../components/useTrackerMotionValue'
import { motion, useTransform } from 'framer-motion'
import { a, useTransition } from "@react-spring/web";
import { easing } from 'maath'
import axios from "axios";
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
// import { Carousel, Typography, Button } from "@material-tailwind/react";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
extend({ TextGeometry })

const FADE_INTERVAL_MS = 2000
const WORD_CHANGE_INTERVAL_MS = FADE_INTERVAL_MS * 2
const WORDS_TO_ANIMATE = ['Hello', 'Ciao', 'Jambo', 'Bonjour', 'Salut', 'Hola', 'Nǐ hǎo', 'Hallo', 'Hej', '👋🏻']
const texts = ['Hello', 'Ciao', 'Jambo', 'Bonjour', 'Salut', 'Hola', 'Nǐ hǎo', 'Hallo', 'Hej', '👋🏻']
const time_between_text = 2; // text show for 2s before fade out.
const transition_duration = 0.5;

const image1 = '/images/0005.JPG'
const image2 = '/images/screenshot1.png'
const image3 = '/images/image1.png'
const image4 = '/images/image3.png'
// const image2 = 'https://source.unsplash.com/random/1600x1000/?cyberpunk'
// const image3 = 'https://source.unsplash.com/random/1600x1000/?scifi'
// const image4 = 'https://source.unsplash.com/random/1600x1000/?synthwave'

type FadeProp = { fade: 'fade-in' | 'fade-out' }

const WordFade = ({ words = [], duration = 3000 }: { words: string[]; duration: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div id="TitleText" className="word-fade">
      {words.map((word, i) => (
        <div
          key={i}
          className={`word ${i === index ? 'fade-in' : 'fade-out'}`}
        >
          {word}, I'm Arief.
        </div>
      ))}
    </div>
  );
};

const Carousel = () => {
  const slides = [
    {
      url: '/images/image1.png',
      description: 'Aspace',
      details: 'A metaverse featuring multiplayer made with Babylon.js & Colyseus using Vue.js as the framework. I developed metaverses featuring multiplayer using Babylon.js and Colyseus. I used Babylon.js to create and render the 3D models, materials, lights, cameras, and scenes for the metaverses. I used Colyseus to create and manage the game rooms, state synchronization, networking, and interactivity for the multiplayer features.',
    },
    {
      url: '/images/screenshot1.png',
      description: 'Bitaverse',
      details: 'A metaverse featuring multiplayer made with Babylon.js & Colyseus using React as the framework. I developed metaverses featuring multiplayer using Babylon.js and Colyseus. I used Babylon.js to create and render the 3D models, materials, lights, cameras, and scenes for the metaverses. I used Colyseus to create and manage the game rooms, state synchronization, networking, and interactivity for the multiplayer features.',
    },
    {
      url: '/images/image3.png',
      description: '3D Van interior configurator',
      details: 'I developed an online 3D product customizer using Three.js, a JavaScript library for 3D graphics. The web app lets users customize and preview vehicle interiors for a particular model of a van.',
    },
    {
      url: '/images/Screenshot4.png',
      description: 'Closepay',
      details: 'I developed web applications for a fintech startup using various frameworks, mainly React and Next.js. The company focuses on payment systems especially in the educational industry.',
    },
    /* {
      url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    }, */
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = ({ slideIndex }: { slideIndex: number }) => {
    setCurrentIndex(slideIndex);
  };

  //for every second change the slide
  useEffect(() => {
    //preload all images first
    slides.forEach((slide) => {
      new Image().src = slide.url;
    });

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className='max-w-[1400px] h-full w-full m-auto py-0 px-4 relative group'>
      <div
        style={{
          backgroundImage: `url(${slides[currentIndex].url})`, backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className='w-full h-3/4 rounded-2xl bg-center bg-cover duration-500'
      >
      </div>
      <div className='absolute bottom-0 left-0 w-full h-1/4 bg-black/50 rounded-2xl p-4'>
        <br />
        <p className='text-white text-2xl font-bold'>
          {slides[currentIndex].description}
        </p>
        <h4 className='text-white text-lg font-light h-80'>
          {slides[currentIndex].details}
        </h4>
      </div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[36%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[36%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide({ slideIndex: slideIndex })}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}
const AnimatedText = () => {
  /* const [fadeProp, setFadeProp] = useState<FadeProp>({ fade: 'fade-in' })
  const [wordOrder, setWordOrder] = useState(0)

  useEffect(() => {
    const fadeTimeout = setInterval(() => {
      fadeProp.fade === 'fade-in' ? setFadeProp({ fade: 'fade-out' }) : setFadeProp({ fade: 'fade-in' })
    }, FADE_INTERVAL_MS)

    return () => clearInterval(fadeTimeout)
  }, [fadeProp])

  useEffect(() => {
    const wordTimeout = setInterval(() => {
      setWordOrder((prevWordOrder) => (prevWordOrder + 1) % WORDS_TO_ANIMATE.length)
    }, WORD_CHANGE_INTERVAL_MS)

    return () => clearInterval(wordTimeout)
  }, [])

  return (
    <h2 id="TitleText">
      <span className={fadeProp.fade}>{WORDS_TO_ANIMATE[wordOrder]}</span>, I'm Arief.
    </h2>
  )  */
  const words: string[] = ['Hello', 'Ciao', 'Jambo', 'Bonjour', 'Salut', 'Hola', 'Nǐ hǎo', 'Hallo', 'Hej', '👋🏻'];
  return <WordFade words={words} duration={2000} />;
}

const Loader = () => {
  const { active, progress } = useProgress();
  const transition = useTransition(active, {
    from: { opacity: 1, progress: 0 },
    leave: { opacity: 0 },
    update: { progress },
  });
  return transition(
    ({ progress, opacity }, active) =>
      active && (
        <a.div className='loading' style={{ opacity }}>
          <div className='loading-bar-container'>
            <a.div className='loading-bar' style={{ width: progress }}></a.div>
          </div>
        </a.div>
      )
  );
}

const ShaderPlane = ({ vertex, fragment, position }: { vertex: string; fragment: string; position: Array<number> }) => {
  const meshRef = useRef(null);
  let ratio

  if (window.innerWidth < 600) {
    ratio = 1
  } else {
    ratio = 1.5
  }

  // Load the noise texture and update the shader uniform
  const noiseTexture = useTexture("noise2.png");
  useFrame((state) => {
    let time = state.clock.getElapsedTime();

    // start from 20 to skip first 20 seconds ( optional )
    /* if (meshRef.current != undefined) {
      meshRef.current.material.uniforms.iTime.value = time + 20;
    } */
  });

  // Define the shader uniforms with memoization to optimize performance
  const uniforms = useMemo(
    () => ({
      iTime: {
        type: "f",
        value: 1.0,
      },
      iResolution: {
        type: "v2",
        value: new THREE.Vector2(4, 3),
      },
      iChannel0: {
        type: "t",
        value: noiseTexture,
      },
    }),
    []
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4 * ratio, 3 * ratio]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const ViewportDemo = () => {
  const el = useRef(null)
  return (
    <>
      <section ref={el} className="TitleArea Debug">
        <div ref={el} className="Placeholder ViewportScrollScene" style={{ touchAction: 'pan-x' }}></div>
        <UseCanvas>
          <Viewport el={el} />
        </UseCanvas>
      </section>
    </>
  )
}

const ViewportDemo2 = () => {
  const el = useRef(null)
  return (
    <>
      <section ref={el} className="TitleArea Debug">
        <div ref={el} className="Placeholder ViewportScrollScene" style={{ touchAction: 'pan-x' }}></div>
        <UseCanvas>
          <Viewport2 el={el} />
        </UseCanvas>
      </section>
    </>
  )
}

const Viewport = ({ el }: { el: any; }) => {
  // State variables to store the vertex and fragment shaders as strings
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  // Fetch the shaders once the component mounts
  useEffect(() => {
    // fetch the vertex and fragment shaders from public folder
    axios.get("/vertexShader.glsl").then((res) => setVertex(res.data));
    axios.get("/fragmentShader.glsl").then((res) => setFragment(res.data));
  }, []);

  // If the shaders are not loaded yet, return null (nothing will be rendered)
  if (vertex == "" || fragment == "") return null;

  return (
    /* Disable hideOffscreen to avoid jank */
    <ViewportScrollScene track={el} hideOffscreen={false}>
      {(props) => (
        <>
          <mesh>
            {/* <boxGeometry /> */}
            {/* <TitleText el={undefined} /> */}

            <ShaderPlane vertex={vertex} fragment={fragment} position={[0, -4, 0]} />

            <Model rotation={[0, 180, 0]} scale={0.7} />

            <MeshTransmissionMaterial
              chromaticAberration={1}
              thickness={0.3}
              transmission={1}
              anisotropy={0.5}
              distortion={5}
              distortionScale={1.5}
              temporalDistortion={0.1}
              metalness={0.1}
              backside
              resolution={256}
              backsideResolution={256}
            />
          </mesh>
          <Environment preset="dawn" />
          <PerspectiveCamera fov={14} position={[0, 0, 20]} makeDefault onUpdate={(self) => self.lookAt(0, 0, 0)} />
          {/* OrbitControls add touchAction='none' to the canvas eventSource and never removes it after events.connected changes it
              - need to manually pass in tracked domElement to keep touch scrolling working */}
          {/* <OrbitControls domElement={props.track.current} makeDefault enableZoom={false} /> */}
          {/* <CameraControls makeDefault /> */}
        </>
      )}
    </ViewportScrollScene>
  )
}

const Viewport2 = ({ el }: { el: any; }) => {
  // State variables to store the vertex and fragment shaders as strings
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");

  // Fetch the shaders once the component mounts
  useEffect(() => {
    // fetch the vertex and fragment shaders from public folder
    axios.get("/vertexShader.glsl").then((res) => setVertex(res.data));
    axios.get("/fragmentShader.glsl").then((res) => setFragment(res.data));
  }, []);

  // If the shaders are not loaded yet, return null (nothing will be rendered)
  if (vertex == "" || fragment == "") return null;

  return (
    /* Disable hideOffscreen to avoid jank */
    <ViewportScrollScene track={el} hideOffscreen={false}>
      {(props) => (
        <>
          <mesh>
            {/* <boxGeometry /> */}
            {/* <TitleText el={undefined} /> */}

            {/* <ShaderPlane vertex={vertex} fragment={fragment} position={[0, -4, 0]} /> */}

            {/* <Model rotation={[0, 180, 0]} scale={0.7} /> */}

            {/* <Diamond position={[1.25, -0.5, 0]} scale={0.37} /> */}
            {/* <Diamond position={[1.8, -1.6, 0]} scale={0.5} /> */}
            <Sphere args={[2, 16, 16]} position={[0, 0, 0]} />

            <MeshTransmissionMaterial
              chromaticAberration={1}
              thickness={0.3}
              transmission={1}
              anisotropy={0.5}
              distortion={5}
              distortionScale={1.5}
              temporalDistortion={0.1}
              metalness={0.1}
              backside
              resolution={256}
              backsideResolution={256}
            />
          </mesh>
          <Environment preset="dawn" />
          <PerspectiveCamera fov={14} position={[0, 0, 20]} makeDefault onUpdate={(self) => self.lookAt(0, 0, 0)} />
          {/* OrbitControls add touchAction='none' to the canvas eventSource and never removes it after events.connected changes it
              - need to manually pass in tracked domElement to keep touch scrolling working */}
          {/* <OrbitControls domElement={props.track.current} makeDefault enableZoom={false} /> */}
          {/* <CameraControls makeDefault /> */}
        </>
      )}
    </ViewportScrollScene>
  )
}

const TitleText = ({ el }: { el: string }) => {
  let size
  let font = "/fonts/XYBER - Regular.otf"

  if (window.innerWidth < 600) {
    size = 0.35
  } else {
    size = 0.7
  }

  return <Text font={font} fontSize={size}>Catalyst</Text>
}

function HorizontalMarquee({ children }: { children: string }) {
  const el = useRef<HTMLElement>(null!)
  const tracker = useTracker(el)
  const progress = useTrackerMotionValue(tracker)

  const x = useTransform(progress, [0, 1], ['0vw', '-50vw'])

  return (
    <section ref={el} className="Marquee Debug">
      <motion.div style={{ x }}>
        <h1>{children}</h1>
      </motion.div>
    </section>
  )
}

function AboutSection({ id, src, ...props }: { id: string, src: string }) {
  const el = useRef<HTMLElement>(null!)
  const tracker = useTracker(el)
  const progress = useTrackerMotionValue(tracker)

  const textY = useTransform(progress, [0, 1], ['25%', '-25%'])
  const imageY = useTransform(progress, [0, 1], ['-25vh', '25vh'])

  const [ratio, setRatio] = useState();
  const [width, setWidth] = useState("w-1/2");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        // setRatio("5vw");
        // document.getElementById("SphereViewport")!.style.zIndex = "-10";

      } else {
        // setRatio("2vw");
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div id="aboutSection">
        <section ref={el} className="VerticalParallax Debug">
          <motion.div className="VerticalParallaxMotion" style={{ y: textY }}>
            <h2 className="gradient-text">About</h2>
          </motion.div>
          <motion.div className="Image" style={{ y: imageY }}>
            <WebGLImageContainer src={src} id={id} />
          </motion.div>
        </section>
        <section>
          <div className="flex w-screen h-[50vh]">
            <p className={"text-justify text-lg w-[87vw] max-w-full"} style={{ fontSize: ratio }}>I am a creative developer with a passion for creating visually appealing and interactive user experiences. My expertise lies in designing and developing web applications that seamlessly blend aesthetics with functionality. I possess proficiency in a range of programming languages and frameworks, including C#, Python, Javascript, Typescript, React.js, Next.js, Vue.js, Gatsby.js as well as experience with WebGL technologies like Babylon.js and Three.js. Additionally, I have a solid foundation in 3D design tools such as Blender and Maya, along with hands-on experience in game development using WebGL.
            </p>
            <div id="SphereViewport" className="absolute w-screen h-full -z-10">
              <ViewportDemo2 />
            </div>
          </div>
          <section className="h-[25vh] bg-gradient-to-b from-transparent to-black">&nbsp;</section>
        </section>
      </div>
    </>
  )
}

function VerticalParallax({ children, ...props }: { children: string }) {
  const el = useRef<HTMLElement>(null!)
  const tracker = useTracker(el)
  const progress = useTrackerMotionValue(tracker)

  const textY = useTransform(progress, [0, 1], ['25%', '-25%'])
  const imageY = useTransform(progress, [0, 1], ['-25vh', '25vh'])

  return (
    <section ref={el} className="VerticalParallax Debug">
      <motion.div className="VerticalParallaxMotion" style={{ y: textY }}>
        <h2>{children}</h2>
      </motion.div>
      <motion.div className="Image" style={{ y: imageY }}>
        <WebGLImageContainer src={image1} />
      </motion.div>
    </section>
  )
}

function LoadingIndicator({ scale }: { scale: any; }) {
  const box = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    box.current.rotation.x = box.current.rotation.y += delta * Math.PI
  })
  return (
    <Box ref={box} scale={scale.xy.min() * 0.25}>
      <meshNormalMaterial />
    </Box>
  )
}

/* function WebGLImageContainer({ src, position, loading = 'eager' }: { src: any; position?: THREE.Vector3 ;loading?: any; }) {
  const el = useRef(null!)
  const img = useRef(null!)
  const { hasSmoothScrollbar } = useScrollRig()
  return (
    <>
      <div ref={el} className="Placeholder ScrollScene">
        <img className={styles.hiddenWhenSmooth} ref={img} loading={loading} src={src} alt="This will be loaded as a texture" />
      </div>
      {hasSmoothScrollbar && (
        <UseCanvas>
          <ScrollScene track={el} debug={false}>
            {(props) => (
              <React.Suspense fallback={<LoadingIndicator {...props} />}>
                <WebGLImage position={position} imgRef={img} {...props} />
              </React.Suspense>
            )}
          </ScrollScene>
        </UseCanvas>
      )}
    </>
  )
} */

function WebGLImage({ imgRef, position, ...props }: { imgRef: any; position?: number[] }) {
  // Load texture from the <img/> and suspend until its ready
  const texture = useImageAsTexture(imgRef)
  return (
    <mesh {...props}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <MeshDistortMaterial transparent map={texture} radius={0.99} distort={0.2} speed={3} />
    </mesh>
  )
}

/* const WebGLImage = (image, index, offset, factor, header, aspect, text) => {
  const size = aspect < 1 && !mobile ? 0.65 : 1


  return (
    // <Plane map={image} args={[1, 1, 32, 32]} shift={75} size={size} aspect={aspect} scale={[w * size, (w * size) / aspect, 1]} frustumCulled={false} />
    <Plane map={image} args={[1, 1, 32, 32]} shift={75} size={size} aspect={aspect} scale={[w * size, (w * size) / aspect, 1]} frustumCulled={false} />
  )
}
*/

/* const WebGLImageContainer = ({ id, src, loading = 'eager' }: { id: string; src: string; loading: string }) => {
  const el = useRef(null!)
  const img = useRef()
  const { hasSmoothScrollbar } = useScrollRig()
  return (
    <>
      {hasSmoothScrollbar && (
        <div id={id} ref={el} className="Placeholder ScrollScene">
          <img className={styles.hiddenWhenSmooth} ref={img} loading={loading} src={src} alt="This will be loaded as a texture" />
          <UseCanvas>
            <ScrollScene track={el}>
              {(props) => (
                <mesh {...props}>
                  <planeGeometry args={[1, 1, 16, 16]} />
                  <MeshDistortMaterial speed={5} distort={0.2}>
                    <GradientTexture
                      stops={[0, 1]} // As many stops as you want
                      colors={['magenta', 'turquoise']} // Colors need to match the number of stops
                      rotation={0.5}
                    />
                  </MeshDistortMaterial>
                </mesh>
              )}
            </ScrollScene>
          </UseCanvas>
        </div>
    )}
    </>
  )
} */

const WebGLImageContainer = ({ id, src, loading = 'eager' }: { id?: string; src: string; loading?: any }) => {
  const el = useRef(null!)
  const img = useRef(null)
  const { hasSmoothScrollbar } = useScrollRig()
  return (
    <>
      <div ref={el} className="Placeholder ScrollScene">
        <img className={styles.hiddenWhenSmooth} id={id} ref={img} loading={loading} src={src} alt="This will be loaded as a texture" />
      </div>
      {/* {hasSmoothScrollbar && (
        <UseCanvas>
          <ScrollScene track={el} debug={false}>
            {(props) => (
              <React.Suspense fallback={<LoadingIndicator {...props} />}>
                <WebGLImage imgRef={img} {...props} />
              </React.Suspense>
            )}
          </ScrollScene>
        </UseCanvas>
      )} */}
    </>
  )
}

function Header() {
  const handleClickScrollAboutSection = () => {
    const element = document.getElementById('aboutSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClickScrollProjectsSection = () => {
    const element = document.getElementById('projectsSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 p-0">
      <div className="flex items-center justify-between px-10 py-5 w-screen" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
        <div className="flex items-center">
          <img className="h-10" src="/logo192.png" alt="logo" />
          <h1 className="ml-2 text-2xl font-bold text-white">Arief R. Syauqie</h1>
        </div>
        <div className="flex items-center space-x-4 text-white">
        </div>
        <div id="hero-section">
          <button className="btn" onClick={handleClickScrollAboutSection}>
            About
          </button>
          <button className="btn" onClick={handleClickScrollProjectsSection}>
            Projects
          </button>
        </div>
      </div>
    </header>
  )
}

const IndexPage: React.FC<PageProps> = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SmoothScrollbar>
        {(bind) => (
          <article {...bind}>
            <article id="TitleContainer">
              <AnimatedText />
              <ViewportDemo />
            </article>
            <Header />
            {/* <header>@14islands/r3f-scroll-rig + Framer Motion</header> */}
            {/* <section> */}
            {/* <h1>HTML parallax with useTracker() and Framer Motion</h1> */}
            {/* </section> */}

            {/* <section> */}
            {/* <p>
                The <code>useTracker()</code> can be used by regular HTML components to get their progress through the viewport.
              </p> */}
            {/* </section> */}

            {/* <section>&nbsp;</section> */}


            <section>
              <AboutSection src={image1} id="ProfilePicture" />
            </section>

            {/* <section>&nbsp;</section> */}

            {/* <section>
              <ExampleComponent src={image1} position={new THREE.Vector3(-4,-1000,-10)} />
            </section> */}

            {/* <section>
              <p>In this example, we take the scroll progress from the tracker and feed it into a MotionValue.</p>
            </section> */}
            <article className="bg-black">
              <section className="h-[20vh]">&nbsp;</section>
              {/* <section className="h-1/4">&nbsp;</section> */}
              <section className="w-screen h-screen">
                <div id="projectsSection">
                  <HorizontalMarquee>PROJECTS PROJECTS PROJECTS</HorizontalMarquee>
                </div>
                <Carousel />
              </section>
              {/* <header>
              <h1>Project Catalyst</h1>
            </header>
            <section>
              <h1>Basic &lt;ScrollScene/&gt; example</h1>
            </section> */}
              {/* {isTouch && (
              <section>
                <p style={{ color: 'orange' }}>
                  You are on a touch device which means the WebGL won't sync with the native scroll. Consider disabling ScrollScenes for
                  touch devices, or experiment with the `smoothTouch` setting on Lenis.
                </p>
              </section>
            )}
            <section>Both these ScrollScenes are tracking DOM elements and scaling their WebGL meshes to fit.</section> */}
              {/* <section>
                <img src="/images/image1.png"></img>
              <br />
              <img src="/images/image2.png"></img>
              <br />
              <img src="/images/image3.png"></img>
                <img src={image2} />
                <br />
                <img src={image3} />
                <br />
                <img src={image4} />

              </section> */}
            </article>
          </article>
        )}
      </SmoothScrollbar>
      <Loader />
    </>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Portfolio</title>
