import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { FaChild, FaPhoneAlt } from 'react-icons/fa'
import taaa from '../../assets/taaa.jpg'
import thaaa from '../../assets/thaaa.jpg'
import laaaa from '../../assets/laaaa.webp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@tanstack/react-router'
import therapistImg from '../../assets/Therapist1.jpg'
import bannImg from '../../assets/bann.png'
import familyImg from '../../assets/family.png'
import {
  Heart,
  Star,
  Sparkles,
  Users,
  Award,
  Clock,
  Stethoscope,
  Baby,
  PartyPopper,
} from 'lucide-react'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const floatingElementsRef = useRef([])
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const expertsRef = useRef(null)
  const reviewsRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 })
  const isExpertsInView = useInView(expertsRef, { once: true, amount: 0.2 })
  const isReviewsInView = useInView(reviewsRef, { once: true, amount: 0.2 })

  const stats = [
    { icon: '🎈', number: '1', label: 'Location in Bangalore' },
    { icon: '👶', number: '500+', label: 'Children Served' },
    { icon: '🗨️', number: '1,200+', label: 'Speech Sessions' },
    { icon: '🏃', number: '800+', label: 'Therapy Hours' },
    { icon: '🏆', number: '95%', label: 'Success Rate' },
    { icon: '👨‍👩‍👧', number: '300+', label: 'Families Supported' },
    { icon: '🧑‍⚕️', number: '5', label: 'Certified Therapists' },
  ]

  const experts = [
    {
      name: 'Dr. Sweata Das',
      title: 'Physiotherapist',
      description:
        'Focused to improve movement, balance and overall child development.',
      image: therapistImg,
      linkedin: '#',
    },
    {
      name: 'Dr. Rajesh Kumar',
      title: 'Certified ABA Therapist',
      description:
        'Expert in behavioral interventions and early autism support.',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      linkedin: '#',
    },
    {
      name: 'Dr. Emily Clark',
      title: 'Speech-Language Pathologist',
      description:
        'Focuses on improving communication and language skills in children.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      linkedin: '#',
    },
    {
      name: 'Dr. Arjun Patel',
      title: 'Physiotherapist',
      description: 'Experienced in aqua therapy and physical rehabilitation.',
      image: 'https://randomuser.me/api/portraits/men/12.jpg',
      linkedin: '#',
    },
  ]

  const reviews = [
    {
      text: 'Highly recommend. Good experience, professional, will take you till the end.',
      name: 'Rakhee Sharma',
      photo: bannImg,
    },
    {
      text: "Latika ma'am is very humble and inclusive in her job. Because of her persistent efforts my kid who was non-verbal can now communicate effectively.",
      name: 'Dr. Himanshu Malik',
      photo: familyImg,
    },
    {
      text: "Latika ma'am is very diligent, hardworking and wonderful. My child has shown huge improvements with her intervention.",
      name: 'Poonam Rana',
      photo: bannImg,
    },
    {
      text: 'We are grateful for the safe and supportive environment provided here. My child enjoys every session.',
      name: 'Pragati Singh',
      photo: bannImg,
    },
    {
      text: 'The therapists are very compassionate and patient. I have seen amazing progress in my child.',
      name: 'Anita Verma',
      photo: bannImg,
    },
    {
      text: 'Thanks to the continuous feedback and personalized plans, my child is doing much better now.',
      name: 'Rohit Sharma',
      photo: bannImg,
    },
  ]

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useGSAP(() => {
    // Set all character spans to inline-block for individual animation
    gsap.set('.tagline span span', { display: 'inline-block' })

    const tl = gsap.timeline()

    // Left image slides in from left
    tl.fromTo(
      '.left-image',
      { x: -500, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5 },
    )

    // Right image slides in from right at the same time
    tl.fromTo(
      '.right-image',
      { x: 500, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5 },
      '<', // Start at the same time as the previous animation
    )

    // "Partnering with Parents" appears from behind left image
    tl.fromTo(
      '.partnering-text',
      { x: -500, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.7)' },
      '-=0.8',
    )

    // "Empowering Every Child" appears from behind right image
    tl.fromTo(
      '.empowering-text',
      { x: 500, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.7)' },
      '-=0.6',
    )

    // Below content loads
    tl.fromTo(
      '.below-content',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.3',
    )

    // Finally "Play. Partner. Empower." appears with character animations
    tl.fromTo(
      '.tagline',
      { y: -30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'bounce.out' },
      '-=0.2',
    )

    // Character-by-character animations for "Play"
    tl.fromTo(
      '.play-word span',
      {
        y: -50,
        opacity: 0,
        rotation: 360,
        scale: 0.5,
        color: '#ff6b6b',
      },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        color: '#c2057a',
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.1,
      },
      '-=0.5',
    )

    // Character-by-character animations for "Partner"
    tl.fromTo(
      '.partner-word span',
      {
        y: 50,
        opacity: 0,
        rotation: -180,
        scale: 0.3,
        color: '#4ecdc4',
      },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        color: '#c2057a',
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: 0.08,
      },
      '-=0.3',
    )

    // Character-by-character animations for "Empower"
    tl.fromTo(
      '.empower-word span',
      {
        y: -40,
        opacity: 0,
        rotation: 270,
        scale: 0.2,
        color: '#45b7d1',
      },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        scale: 1,
        color: '#c2057a',
        duration: 0.8,
        ease: 'bounce.out',
        stagger: 0.12,
      },
      '-=0.2',
    )

    // Add playful continuous animations
    tl.add(() => {
      // Grooving left-right animation for individual characters
      gsap.fromTo(
        '.tagline span span',
        { x: -3 },
        {
          x: 3,
          rotation: 2,
          duration: 0.8,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.1,
        },
      )
    }, '+=0.5')

    // Why Choose Us scroll-triggered animations
    // Set initial states
    gsap.set('.why-choose-heading', { scale: 1.5, opacity: 0 })
    gsap.set('.why-choose-image', { x: -200, opacity: 0 })
    gsap.set('.why-choose-text p, .why-choose-text a', { x: 200, opacity: 0 })

    // Create enter animation timeline
    const whyChooseEnterTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.why-choose-heading',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    whyChooseEnterTl
      // First: Heading scales down to normal size
      .to('.why-choose-heading', {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
      // Then: Image slides in from left
      .fromTo(
        '.why-choose-image',
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        '-=0.3',
      )
      // Simultaneously: Text content slides in from right
      .fromTo(
        '.why-choose-text p, .why-choose-text a',
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out', stagger: 0.1 },
        '<',
      )
  })

  // GSAP animations for floating elements
  useEffect(() => {
    const elements = floatingElementsRef.current

    elements.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: -20,
          rotation: 5,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: index * 0.3,
        })
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={(el) => (floatingElementsRef.current[0] = el)}
          className="absolute top-20 left-10 text-purple-200 opacity-60"
        >
          <Heart size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[1] = el)}
          className="absolute top-32 right-20 text-pink-200 opacity-60"
        >
          <Star size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute top-80 left-1/4 text-indigo-200 opacity-60"
        >
          <Sparkles size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute top-160 right-30 text-indigo-200 opacity-60"
        >
          <FaChild size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute top-250 left-20 text-indigo-200 opacity-60"
        >
          <Baby size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute top-350 left-100 text-indigo-200 opacity-60 z-60"
        >
          <PartyPopper size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[3] = el)}
          className="absolute bottom-40 right-10 text-purple-200 opacity-60"
        >
          <Heart size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[4] = el)}
          className="absolute bottom-20 left-16 text-pink-200 opacity-60"
        >
          <Sparkles size={80} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 px-[5%] py-12 flex-wrap mt-10"
        >
          {/* First Image */}
          <div className="left-image flex-1 min-w-[280px] relative flex justify-center items-center order-1 z-10">
            <img
              src={taaa}
              alt="Child with mask"
              className="w-120 h-auto relative z-20"
              style={{
                borderRadius: '26% 74% 68% 32% / 32% 30% 70% 68%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>

          {/* Text Content */}
          <div className="text-content flex-1 min-w-[300px] order-2 mt-30 relative">
            <p className="tagline text-3xl text-[#c2057a] uppercase tracking-wider font-extrabold text-nowrap">
              <span className="play-word inline-block cursor-pointer hover:scale-110 transition-transform duration-300">
                <span className="char-p">P</span>
                <span className="char-l">l</span>
                <span className="char-a">a</span>
                <span className="char-y">y</span>
              </span>
              <span className="text-[#c2057a]">.</span>{' '}
              <span className="partner-word inline-block cursor-pointer hover:scale-110 transition-transform duration-300">
                <span className="char-p2">P</span>
                <span className="char-a2">a</span>
                <span className="char-r">r</span>
                <span className="char-t">t</span>
                <span className="char-n">n</span>
                <span className="char-e">e</span>
                <span className="char-r2">r</span>
              </span>
              <span className="text-[#c2057a]">.</span>{' '}
              <span className="empower-word inline-block cursor-pointer hover:scale-110 transition-transform duration-300">
                <span className="char-e2">E</span>
                <span className="char-m">m</span>
                <span className="char-p3">p</span>
                <span className="char-o">o</span>
                <span className="char-w">w</span>
                <span className="char-e3">e</span>
                <span className="char-r3">r</span>
              </span>
              <span className="text-[#c2057a]">.</span>
            </p>
            <h1 className="text-5xl font-bold text-[#12010e] leading-loose font-sans">
              <span className="partnering-text text-[#52016d] text-[30px] absolute top-15 left-[-10px] z-5">
                Partnering with Parents,
              </span>
              <br />
              <span className="empowering-text text-[#52016d] text-[30px] absolute top-30 right-[-20px] z-5">
                Empowering Every Child
              </span>
            </h1>
            <div className="below-content mt-20">
              <p className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
                At Tiny Steps, we believe every child has unique potential.
                Through personalized therapy and family collaboration, we help
                children thrive and reach their developmental milestones with
                confidence and joy.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/contact" className="flex items-center gap-2">
                  <FaPhoneAlt size={18} />
                  Get Started Today
                </Link>
              </motion.button>
            </div>
          </div>

          {/* Second Image */}
          <div className="right-image flex-1 min-w-[280px] relative flex justify-center items-center order-3 z-10">
            <img
              src={thaaa}
              alt="Child therapy"
              className="w-120 h-auto relative z-20"
              style={{
                borderRadius: '74% 26% 32% 68% / 70% 70% 30% 32%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          ref={statsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-[5%]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isStatsInView ? { scale: 1 } : { scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
              >
                <Award className="text-purple-600" size={20} />
                <span className="text-purple-800 font-semibold">
                  Our Impact
                </span>
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                Making a Real Difference
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Every number represents a child who found their voice, a family
                who found hope, and a milestone achieved together.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={
                    isStatsInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 30, scale: 0.9 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Experts Section */}
        <motion.section
          ref={expertsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isExpertsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-[5%] bg-white/30 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isExpertsInView ? { scale: 1 } : { scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
              >
                <Stethoscope className="text-purple-600" size={20} />
                <span className="text-purple-800 font-semibold">Our Team</span>
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                Meet Our Expert Therapists
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our certified professionals bring years of experience and
                genuine care to help your child reach their full potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {experts.map((expert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={
                    isExpertsInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 30, scale: 0.9 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 text-center shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Star size={16} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {expert.name}
                  </h3>
                  <p className="text-purple-600 font-semibold mb-3">
                    {expert.title}
                  </p>
                  <p className="text-gray-600 text-sm">{expert.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          ref={reviewsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isReviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-[5%]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isReviewsInView ? { scale: 1 } : { scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
              >
                <Users className="text-purple-600" size={20} />
                <span className="text-purple-800 font-semibold">
                  Testimonials
                </span>
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                What Families Say About Us
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Real stories from real families who have experienced the
                transformative power of our therapy programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={
                    isReviewsInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 30, scale: 0.9 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={review.photo}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.name}
                      </p>
                      <p className="text-sm text-gray-500">Parent</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <section className="py-20 px-[5%]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Start Your Child's Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Let's work together to unlock your child's full potential. Book
                a consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/contact" scroll={false}>
                    Schedule Consultation
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  <Link to="/services">Explore Services</Link>
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
