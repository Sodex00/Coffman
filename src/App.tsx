import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bean,
  Clock3,
  Coffee,
  CupSoda,
  Flame,
  Menu,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react'
import * as THREE from 'three'
import logo from './assets/brand/coffman-logo.png'
import './App.css'

const menu = [
  { name: 'Espresso Nero', note: 'Плотный двойной шот, карамельная горчинка', price: '190 ₽' },
  { name: 'Cappuccino Velvet', note: 'Молочная пена, какао, мягкое послевкусие', price: '280 ₽' },
  { name: 'Raf Vanilla Smoke', note: 'Сливки, ваниль, легкий дымный сироп', price: '340 ₽' },
  { name: 'Latte Salted Caramel', note: 'Эспрессо, соленая карамель, кремовая текстура', price: '330 ₽' },
  { name: 'Cold Brew Citrus', note: '18 часов настаивания, апельсиновый тон', price: '310 ₽' },
  { name: 'Mocha Dark', note: 'Темный шоколад, эспрессо, бархатное молоко', price: '350 ₽' },
]

const extras = [
  'Круассан с миндалем - 230 ₽',
  'Брауни на бельгийском шоколаде - 260 ₽',
  'Сырники с кофейной карамелью - 320 ₽',
]

function CoffeeScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 1.6, 6.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const cupGroup = new THREE.Group()
    scene.add(cupGroup)

    const cupMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1512',
      roughness: 0.42,
      metalness: 0.2,
    })
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: '#c7833e',
      roughness: 0.28,
      metalness: 0.74,
    })
    const coffeeMaterial = new THREE.MeshStandardMaterial({
      color: '#5a2c12',
      roughness: 0.3,
      metalness: 0.08,
    })

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.05, 1.65, 96, 1, true),
      cupMaterial,
    )
    cup.position.y = -0.55
    cupGroup.add(cup)

    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.055, 18, 120), rimMaterial)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.3
    cupGroup.add(rim)

    const coffee = new THREE.Mesh(new THREE.CylinderGeometry(1.44, 1.44, 0.045, 96), coffeeMaterial)
    coffee.position.y = 0.305
    cupGroup.add(coffee)

    const cremaMaterial = new THREE.MeshStandardMaterial({
      color: '#f1c27b',
      roughness: 0.55,
      metalness: 0.02,
    })

    for (let i = 0; i < 5; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.26 + i * 0.18, 0.012, 8, 96, Math.PI * 1.55),
        cremaMaterial,
      )
      ring.rotation.set(Math.PI / 2, 0, i * 0.86)
      ring.position.set(0.02 * i, 0.34 + i * 0.002, -0.02 * i)
      cupGroup.add(ring)
    }

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.075, 20, 80), rimMaterial)
    handle.scale.set(0.72, 1, 1)
    handle.rotation.y = Math.PI / 2
    handle.position.set(1.58, -0.28, 0)
    cupGroup.add(handle)

    const beans = Array.from({ length: 34 }, (_, index) => {
      const bean = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 20, 12),
        new THREE.MeshStandardMaterial({ color: index % 2 ? '#8f4d22' : '#c1742c', roughness: 0.6 }),
      )
      const angle = (index / 34) * Math.PI * 2
      const radius = 2.15 + Math.sin(index) * 0.35
      bean.position.set(Math.cos(angle) * radius, Math.sin(index * 0.7) * 0.75, Math.sin(angle) * radius)
      bean.scale.set(1, 0.55, 0.82)
      scene.add(bean)
      return bean
    })

    scene.add(new THREE.AmbientLight('#ffd8b0', 0.85))
    const key = new THREE.PointLight('#ffb35d', 4.8, 12)
    key.position.set(2.2, 3.4, 3.5)
    scene.add(key)
    const blue = new THREE.PointLight('#5f7bff', 1.2, 10)
    blue.position.set(-3.2, -0.4, 2.4)
    scene.add(blue)

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
      cupGroup.rotation.y = Math.sin(t * 0.36) * 0.34
      cupGroup.rotation.x = -0.12 + Math.sin(t * 0.22) * 0.04
      beans.forEach((bean, index) => {
        bean.rotation.y += 0.012 + index * 0.0002
        bean.position.y += Math.sin(t * 1.1 + index) * 0.0009
      })
      renderer.render(scene, camera)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="coffee-scene" ref={mountRef} aria-label="3D coffee cup animation" />
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
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Coffman">
          <img src={logo} alt="" />
          <span>
            Coffman
            <small>roastery bar</small>
          </span>
        </a>
        <span className="nav-line" aria-hidden="true" />
        <div className="nav-links">
          <a href="#ritual">Ритуал</a>
          <a href="#visit">Контакты</a>
        </div>
        <button className="menu-trigger" type="button" onClick={() => setIsMenuOpen(true)}>
          <Menu size={18} />
          Меню
        </button>
      </nav>

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
          <h2>Карта напитков спрятана как барная вкладка</h2>
          <p>
            Открой меню отдельным окном: внутри кофе, десерты, цены и короткие вкусовые заметки.
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
            <div className="menu-grid">
              {menu.map((item) => (
                <article className="menu-card" key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.note}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
            <div className="extras">
              {extras.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
