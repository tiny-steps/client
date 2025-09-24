import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { gsap } from 'gsap'
import {
  Heart,
  Star,
  Sparkles,
  Users,
  Shield,
  HandHeart,
  Baby,
  Leaf,
  Smile,
  Clock,
  ArrowRight,
  CheckCircle,
  Target,
  Eye,
  Zap,
  Globe,
  Award,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

const About = () => {
  const navigate = useNavigate()

  const [activeCard, setActiveCard] = useState(null)
  const [visibleSection, setVisibleSection] = useState('hero')

  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const principlesRef = useRef(null)
  const visionRef = useRef(null)
  const floatingElementsRef = useRef([])

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.2 })
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.2 })
  const isPrinciplesInView = useInView(principlesRef, {
    once: true,
    amount: 0.2,
  })
  const isVisionInView = useInView(visionRef, { once: true, amount: 0.2 })
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  // GSAP animations for floating elements
  useEffect(() => {
    const elements = floatingElementsRef.current

    elements.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: -30,
          rotation: 360,
          duration: 3 + index * 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: index * 0.4,
        })
      }
    })
  }, [])

  // Floating sparkle animation
  useEffect(() => {
    const sparkles = document.querySelectorAll('.floating-sparkle')
    sparkles.forEach((sparkle, index) => {
      gsap.to(sparkle, {
        y: -50,
        x: 20,
        rotation: 180,
        opacity: 0.8,
        duration: 4 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.8,
      })
    })
  }, [])

  const coreValues = [
    {
      icon: Users,
      title: 'Inclusive',
      description:
        "At Tiny Steps, we believe every child deserves to feel welcomed and celebrated. Our doors are open to all families, creating a supportive community where diversity is embraced and each child's unique strengths are valued.",
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      icon: Heart,
      title: 'Responsible',
      description:
        "We take our responsibility to heart. Our dedicated team is committed to providing expert, consistent care — ensuring every child's growth, well-being, and happiness remain our top priorities throughout their developmental journey.",
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
    },
    {
      icon: HandHeart,
      title: 'Respectful',
      description:
        "We honour every child's individuality by fostering understanding, kindness, and empathy. By treating children with dignity and respect, we nurture their sense of self-worth and confidence to take bold steps forward.",
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
    },
    {
      icon: Users,
      title: 'Collaborative',
      description:
        'We walk hand in hand with parents, families, and educators. Through strong collaboration, shared expertise, and a warm, supportive environment, we create meaningful progress and remarkable outcomes together.',
      color: 'from-teal-400 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100',
    },
  ]

  const guidingPrinciples = [
    {
      icon: Globe,
      title: 'Inclusive & Welcoming',
      description:
        'Every child belongs. We celebrate diversity and create a safe, nurturing space where every family feels respected and valued.',
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    },
    {
      icon: Heart,
      title: 'Compassion in Every Step',
      description:
        'Care with heart. We meet every family with empathy and kindness; ensuring children feel supported as they grow.',
      color: 'bg-gradient-to-br from-pink-100 to-pink-200',
    },
    {
      icon: Shield,
      title: 'Responsible & Transparent',
      description:
        'Trust matters. Parents place their greatest treasure in our hands – we honor that with consistent, transparent, and ethical care.',
      color: 'bg-gradient-to-br from-green-100 to-green-200',
    },
    {
      icon: Baby,
      title: 'Respectful & Child-Centred',
      description:
        'Every child is unique. We treat every child with dignity and respect, empowering them to believe in themselves.',
      color: 'bg-gradient-to-br from-orange-100 to-orange-200',
    },
    {
      icon: HandHeart,
      title: 'Collaborative Care',
      description:
        'Together, we grow. We partner with parents in every step, co-creating personalized therapy plans for the best outcomes.',
      color: 'bg-gradient-to-br from-blue-100 to-blue-200',
    },
    {
      icon: Leaf,
      title: 'Holistic Growth',
      description:
        'Beyond milestones. We nurture physical, emotional, social, and behavioral development for well-rounded progress.',
      color: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
    },
    {
      icon: Smile,
      title: 'Playful & Positive Environment',
      description:
        'Therapy feels like play — joyful, engaging, and motivating. Every little achievement is celebrated.',
      color: 'bg-gradient-to-br from-red-100 to-red-200',
    },
    {
      icon: Clock,
      title: 'Always Accessible',
      description:
        'Open 7 days a week, so support is always nearby when families need it most.',
      color: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={(el) => (floatingElementsRef.current[0] = el)}
          className="absolute top-20 left-10 text-purple-200 opacity-40"
        >
          <Heart size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[1] = el)}
          className="absolute top-40 right-20 text-pink-200 opacity-40"
        >
          <Star size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute top-96 left-1/4 text-indigo-200 opacity-40"
        >
          <Sparkles size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[3] = el)}
          className="absolute bottom-60 right-16 text-purple-200 opacity-40"
        >
          <Baby size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[4] = el)}
          className="absolute bottom-40 left-20 text-pink-200 opacity-40"
        >
          <Smile size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[5] = el)}
          className="absolute top-1/2 right-1/4 text-indigo-200 opacity-40"
        >
          <Leaf size={80} />
        </div>

        {/* Additional floating sparkles */}
        <div className="floating-sparkle absolute top-32 left-1/2 text-yellow-300 opacity-60">
          <Sparkles size={80} />
        </div>
        <div className="floating-sparkle absolute top-3/4 left-1/3 text-yellow-300 opacity-60">
          <Sparkles size={80} />
        </div>
        <div className="floating-sparkle absolute bottom-1/4 right-1/3 text-yellow-300 opacity-60">
          <Sparkles size={80} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isHeroInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
          >
            <Heart className="text-purple-600" size={20} />
            <span className="text-purple-800 font-semibold">About Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-5xl sm:text-4xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
              With Tiny Steps Today,
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              We Build Endless Possibilities Tomorrow
            </span>
          </motion.h1>
        </motion.div>

        {/* Story Section */}
        <motion.div
          ref={storyRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isStoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Our Story</h2>
              <p className="text-purple-100">
                A journey of dedication, compassion, and transformative care
              </p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isStoryInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg">
                      Parenting is a journey filled with joy, questions, and
                      challenges. Throughout this journey, every parent deserves
                      a reliable support system that truly understands their
                      needs.{' '}
                      <span className="font-semibold text-purple-700">
                        Tiny Steps Child Development Centre
                      </span>{' '}
                      was established to provide exactly that.
                    </p>

                    <p>
                      Founded in{' '}
                      <span className="font-semibold text-pink-600">
                        2023 by Dr Harapriya Jali
                      </span>
                      , Tiny Steps began with a clear mission: to make
                      paediatric and developmental care more personalized,
                      consistent, and compassionate. What started as a single
                      clinic has now grown into a trusted network of
                      neighbourhood centres.
                    </p>

                    <p>
                      Today, Tiny Steps is proud to welcome families{' '}
                      <span className="font-semibold text-indigo-600">
                        seven days a week
                      </span>
                      . Our compassionate team listens with care, treats with
                      dedication, and partners with parents at every stage of
                      their child's development.
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl border border-purple-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-2">
                          Our Mission
                        </h4>
                        <p className="text-purple-700">
                          To empower every child to reach their fullest
                          potential through compassionate, evidence-based care
                          that celebrates uniqueness and builds lasting
                          foundations for lifelong success.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Visual Element */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={
                    isStoryInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                  }
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Award className="text-white" size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">2023</h3>
                          <p className="text-purple-100">Year Established</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">500+</div>
                          <div className="text-purple-100 text-sm">
                            Children Served
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">95%</div>
                          <div className="text-purple-100 text-sm">
                            Success Rate
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">7</div>
                          <div className="text-purple-100 text-sm">
                            Days a Week
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">1</div>
                          <div className="text-purple-100 text-sm">
                            Bangalore Location
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Values Section */}
        <motion.div
          ref={valuesRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={isValuesInView ? { scale: 1 } : { scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
            >
              <Star className="text-purple-600" size={20} />
              <span className="text-purple-800 font-semibold">
                Our Core Values
              </span>
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              What Drives Everything We Do
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our values aren't just words on a wall—they're the heartbeat of
              every interaction, every therapy session, and every moment we
              spend with your family.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isValuesInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 gap-8"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gradient-to-br ${value.bgColor} backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <value.icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Guiding Principles Section */}
        <motion.div
          ref={principlesRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isPrinciplesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={isPrinciplesInView ? { scale: 1 } : { scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8"
            >
              <Target className="text-purple-600" size={20} />
              <span className="text-purple-800 font-semibold">
                Guiding Principles
              </span>
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent mb-4">
              How We Deliver Exceptional Care
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              These principles guide every decision we make, every program we
              design, and every relationship we build with the families we
              serve.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isPrinciplesInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {guidingPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${principle.color} backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                onClick={() =>
                  setActiveCard(activeCard === index ? null : index)
                }
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <principle.icon size={28} className="text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          ref={visionRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isVisionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={isVisionInView ? { scale: 1 } : { scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Eye className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-2xl leading-relaxed opacity-95 mb-8">
                To create a world where every child, regardless of their
                starting point, has the opportunity to flourish, communicate
                confidently, and live independently with joy and purpose.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-purple-100 text-sm">
                    Cutting-edge therapy techniques
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Compassion</h3>
                  <p className="text-purple-100 text-sm">
                    Heart-centered approach to care
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-purple-100 text-sm">
                    Building supportive networks
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isVisionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of families who have chosen Tiny Steps as their
              partner in their child's developmental journey. Let's build your
              child's bright future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate({ to: '/contact' })}
              >
                Schedule a Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
              >
                Learn About Our Services
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
