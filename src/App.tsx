import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bean,
  Clock3,
  Coffee,
  CupSoda,
  Flame,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import * as THREE from 'three'
import almondCroissant from './assets/menu/almond-croissant.png'
import belgianBrownie from './assets/menu/belgian-brownie.png'
import cappuccinoVelvet from './assets/menu/cappuccino-velvet.png'
import coldBrewCitrus from './assets/menu/cold-brew-citrus.png'
import espressoNero from './assets/menu/espresso-nero.png'
import latteSaltedCaramel from './assets/menu/latte-salted-caramel.png'
import mochaDark from './assets/menu/mocha-dark.png'
import rafVanillaSmoke from './assets/menu/raf-vanilla-smoke.png'
import syrnikiCaramel from './assets/menu/syrniki-caramel.png'
import './App.css'

const menuSections = [
  {
    title: 'Напитки',
    kicker: 'coffee bar',
    items: [
      {
        name: 'Espresso Nero',
        note: 'Плотный двойной шот, карамельная горчинка',
        price: '190 ₽',
        image: espressoNero,
      },
      {
        name: 'Cappuccino Velvet',
        note: 'Молочная пена, какао, мягкое послевкусие',
        price: '280 ₽',
        image: cappuccinoVelvet,
      },
      {
        name: 'Raf Vanilla Smoke',
        note: 'Сливки, ваниль, легкий дымный сироп',
        price: '340 ₽',
        image: rafVanillaSmoke,
      },
      {
        name: 'Latte Salted Caramel',
        note: 'Эспрессо, соленая карамель, кремовая текстура',
        price: '330 ₽',
        image: latteSaltedCaramel,
      },
      {
        name: 'Cold Brew Citrus',
        note: '18 часов настаивания, апельсиновый тон',
        price: '310 ₽',
        image: coldBrewCitrus,
      },
      {
        name: 'Mocha Dark',
        note: 'Темный шоколад, эспрессо, бархатное молоко',
        price: '350 ₽',
        image: mochaDark,
      },
    ],
  },
  {
    title: 'Выпечка',
    kicker: 'bakery',
    items: [
      {
        name: 'Almond Croissant',
        note: 'Слоеное тесто, миндальный крем, сахарная пудра',
        price: '230 ₽',
        image: almondCroissant,
      },
      {
        name: 'Belgian Brownie',
        note: 'Темный шоколад, влажная середина, кофейная глазурь',
        price: '260 ₽',
        image: belgianBrownie,
      },
      {
        name: 'Syrniki Caramel',
        note: 'Нежные сырники, кофейная карамель, хрустящая крошка',
        price: '320 ₽',
        image: syrnikiCaramel,
      },
    ],
  },
]

function createCupLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#2a1710')
    gradient.addColorStop(0.48, '#070504')
    gradient.addColorStop(1, '#1a0e0a')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = 'rgba(231, 160, 84, 0.28)'
    ctx.lineWidth = 8
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104)

    ctx.fillStyle = '#f5c477'
    ctx.font = '900 128px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(238, 147, 59, 0.45)'
    ctx.shadowBlur = 28
    ctx.fillText('Coffman', canvas.width / 2, 242)

    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(255, 237, 205, 0.74)'
    ctx.font = '700 34px Arial, sans-serif'
    ctx.letterSpacing = '8px'
    ctx.fillText('ROASTERY BAR', canvas.width / 2, 334)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    for (let i = 0; i < 110; i += 1) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.fillRect(x, y, 1.4, 1.4)
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.repeat.x = 1
  return texture
}

function CoffeeScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0.8, 8.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const cupGroup = new THREE.Group()
    cupGroup.scale.set(1.55, 1.55, 1.55)
    scene.add(cupGroup)

    const labelTexture = createCupLabelTexture()
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: '#1f120d',
      roughness: 0.36,
      metalness: 0.18,
    })
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: '#d99448',
      roughness: 0.24,
      metalness: 0.76,
    })
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: '#050302',
      roughness: 0.5,
      metalness: 0.08,
    })
    const coffeeMaterial = new THREE.MeshStandardMaterial({
      color: '#5a2c12',
      roughness: 0.28,
      metalness: 0.08,
    })

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.28, 2.45, 128, 1, true), cupMaterial)
    cup.position.y = -0.72
    cupGroup.add(cup)

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(2.34, 0.92),
      new THREE.MeshStandardMaterial({
        map: labelTexture,
        transparent: true,
        roughness: 0.34,
        metalness: 0.18,
        emissive: '#2b1305',
        emissiveIntensity: 0.18,
      }),
    )
    label.position.set(0, -0.08, 2.01)
    label.rotation.x = -0.04
    cupGroup.add(label)

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.82, 1.18, 2.2, 128, 1, true), darkMaterial)
    inner.position.y = -0.74
    inner.scale.set(0.985, 0.985, 0.985)
    cupGroup.add(inner)

    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.07, 20, 140), rimMaterial)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.52
    cupGroup.add(rim)

    const bottomRim = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.06, 18, 120), rimMaterial)
    bottomRim.rotation.x = Math.PI / 2
    bottomRim.position.y = -1.93
    cupGroup.add(bottomRim)

    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(1.86, 1.86, 0.055, 128), coffeeMaterial)
    coffee.position.y = 0.54
    cupGroup.add(coffee)

    const cremaMaterial = new THREE.MeshStandardMaterial({
      color: '#f2bf70',
      roughness: 0.42,
      metalness: 0.05,
      emissive: '#4b2108',
      emissiveIntensity: 0.18,
    })

    for (let i = 0; i < 7; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.24 + i * 0.18, 0.014, 8, 120, Math.PI * 1.55),
        cremaMaterial,
      )
      ring.rotation.set(Math.PI / 2, 0, i * 0.92)
      ring.position.set(0.02 * i, 0.59 + i * 0.002, -0.02 * i)
      cupGroup.add(ring)
    }

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.085, 22, 90), rimMaterial)
    handle.scale.set(0.72, 1.05, 1)
    handle.rotation.y = Math.PI / 2
    handle.position.set(2.02, -0.58, 0)
    cupGroup.add(handle)

    const steamMaterial = new THREE.MeshBasicMaterial({
      color: '#f6d6ad',
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const steam = Array.from({ length: 8 }, (_, index) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.7 + index * 0.2, 0.75, 0),
        new THREE.Vector3(-0.9 + index * 0.18, 1.25, 0.08),
        new THREE.Vector3(-0.55 + index * 0.16, 1.7, -0.03),
        new THREE.Vector3(-0.78 + index * 0.19, 2.2, 0.04),
      ])
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 46, 0.012, 8, false), steamMaterial.clone())
      cupGroup.add(mesh)
      return mesh
    })

    const sparks = Array.from({ length: 62 }, (_, index) => {
      const spark = new THREE.Mesh(
        new THREE.SphereGeometry(0.035 + (index % 4) * 0.008, 16, 10),
        new THREE.MeshStandardMaterial({
          color: index % 2 ? '#a64e17' : '#e08631',
          emissive: '#3b1404',
          emissiveIntensity: 0.55,
          roughness: 0.48,
        }),
      )
      const angle = (index / 62) * Math.PI * 2
      const radius = 2.65 + Math.sin(index * 1.7) * 0.8
      spark.position.set(Math.cos(angle) * radius, Math.sin(index * 0.64) * 1.05 - 0.25, Math.sin(angle) * radius)
      scene.add(spark)
      return spark
    })

    const starGeo = new THREE.BufferGeometry()
    const vertices = []
    for (let i = 0; i < 280; i += 1) {
      vertices.push((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 8, -3 - Math.random() * 4)
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const starField = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: '#d3924a', size: 0.018, transparent: true, opacity: 0.36 }),
    )
    scene.add(starField)

    scene.add(new THREE.AmbientLight('#ffd8b0', 0.78))
    const key = new THREE.PointLight('#ffb35d', 7.2, 16)
    key.position.set(3.2, 4.2, 4.2)
    scene.add(key)
    const edge = new THREE.PointLight('#815eff', 1.45, 13)
    edge.position.set(-4.2, -0.6, 3.4)
    scene.add(edge)

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const startedAt = performance.now()
    let frame = 0
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = (performance.now() - startedAt) / 1000
      cupGroup.rotation.y = Math.sin(t * 0.18) * 0.44
      cupGroup.rotation.x = -0.08 + Math.sin(t * 0.32) * 0.055
      cupGroup.rotation.z = Math.sin(t * 0.24) * 0.028
      cupGroup.position.y = Math.sin(t * 0.54) * 0.08
      coffee.rotation.y = t * 0.18
      steam.forEach((mesh, index) => {
        mesh.position.y = Math.sin(t * 0.8 + index) * 0.05
        mesh.rotation.y = Math.sin(t * 0.38 + index) * 0.1
      })
      sparks.forEach((spark, index) => {
        spark.rotation.y += 0.012 + index * 0.0001
        spark.position.y += Math.sin(t * 1.1 + index) * 0.0012
      })
      starField.rotation.z = t * 0.01
      renderer.render(scene, camera)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      labelTexture.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="coffee-scene" ref={mountRef} aria-label="3D Coffman cup animation" />
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.18 },
    )

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isMenuOpen)
    return () => document.body.classList.remove('modal-open')
  }, [isMenuOpen])

  return (
    <main>
      <button className="floating-menu" type="button" onClick={() => setIsMenuOpen(true)}>
        <Menu size={19} />
        Меню
      </button>

      <section className="hero-section" id="top">
        <div className="hero-copy reveal">
          <span className="eyebrow">
            <Sparkles size={16} /> specialty coffee bar
          </span>
          <h1>Coffman</h1>
          <p>
            Темная кофейня с авторскими напитками, тихим светом и зерном, которое раскрывается
            как хорошая история: постепенно, глубоко, с послевкусием.
          </p>
          <div className="hero-actions">
            <button className="primary-link" type="button" onClick={() => setIsMenuOpen(true)}>
              Смотреть меню <ArrowUpRight size={18} />
            </button>
            <a className="ghost-link" href="#visit">Забронировать стол</a>
          </div>
        </div>
        <div className="scene-wrap reveal">
          <CoffeeScene />
        </div>
      </section>

      <section className="stats reveal" aria-label="Coffman highlights">
        <div>
          <Bean />
          <strong>100% arabica</strong>
          <span>Колумбия, Бразилия, Эфиопия</span>
        </div>
        <div>
          <Clock3 />
          <strong>08:00 - 23:00</strong>
          <span>Каждый день без пауз</span>
        </div>
        <div>
          <Flame />
          <strong>Ручная обжарка</strong>
          <span>Малые партии под сезонное меню</span>
        </div>
      </section>

      <section className="section menu-section" id="menu-preview">
        <div className="menu-poster reveal">
          <span className="eyebrow">
            <Coffee size={16} /> меню кофейни
          </span>
          <h2>Карта напитков и выпечки в отдельном барном листе</h2>
          <p>
            Внутри два раздела, крупные фотографии товаров, цены и короткие вкусовые заметки.
          </p>
          <button className="primary-link" type="button" onClick={() => setIsMenuOpen(true)}>
            Открыть карту <CupSoda size={18} />
          </button>
        </div>
      </section>

      <section className="section ritual" id="ritual">
        <div className="ritual-panel reveal">
          <span className="eyebrow">slow bar</span>
          <h2>Каждая чашка проходит свой маленький ритуал</h2>
          <p>
            Мы подбираем помол под влажность дня, прогреваем чашку, балансируем кислотность и
            сладость, а затем подаем кофе в спокойном темном пространстве с медными акцентами.
          </p>
        </div>
        <div className="timeline">
          {['Зерно', 'Помол', 'Экстракция', 'Подача'].map((step, index) => (
            <div className="timeline-item reveal" key={step}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section visit" id="visit">
        <div className="visit-card reveal">
          <MapPin />
          <h2>Встретимся за барной стойкой</h2>
          <p>Владивосток, ул. Кофейная, 12. Заказы навынос, завтраки и вечерние десерты.</p>
          <a className="primary-link" href="tel:+79990000000">
            Позвонить <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {isMenuOpen && (
        <div className="menu-modal" role="dialog" aria-modal="true" aria-labelledby="menu-title">
          <button className="modal-backdrop" type="button" aria-label="Закрыть меню" onClick={() => setIsMenuOpen(false)} />
          <div className="menu-sheet">
            <div className="menu-sheet-head">
              <div>
                <span className="eyebrow">bar card</span>
                <h2 id="menu-title">Меню Coffman</h2>
              </div>
              <button className="close-button" type="button" aria-label="Закрыть меню" onClick={() => setIsMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {menuSections.map((section) => (
              <section className="menu-category" key={section.title}>
                <div className="menu-category-title">
                  <span>{section.kicker}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="menu-grid">
                  {section.items.map((item) => (
                    <article className="menu-card" key={item.name}>
                      <img src={item.image} alt="" />
                      <div className="menu-card-copy">
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.note}</p>
                        </div>
                        <strong>{item.price}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

export default App
