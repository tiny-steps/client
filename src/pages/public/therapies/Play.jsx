import React, { useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'
import {
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Users,
  Clock,
  BookOpen,
  MessageCircle,
  Gamepad2,
  Smile,
} from 'lucide-react'

const Play = () => {
  const floatingElementsRef = useRef([])
  const heroRef = useRef(null)
  const ctaRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 })

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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isHeroInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 mt-15"
          >
            <MessageCircle className="text-purple-600" size={20} />
            <span className="text-purple-800 font-semibold">
              Services We Offer
            </span>
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
              PLAY THERAPY
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h2 className="text-4xl font-bold mb-6">
                    <span className="text-purple-800">Tiny Steps </span>
                    <br />
                    <span className="text-pink-600">
                      Child Development Centre
                    </span>
                  </h2>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Speech Therapy
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6"></div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
                    <Gamepad2 className="w-24 h-24 text-purple-600 mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-6 shadow-lg">
                    <Smile className="w-24 h-24 text-indigo-600 mx-auto" />
                  </div>
                </div>
                <div className="text-left space-y-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isHeroInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-slate-600 text-lg leading-relaxed"
                  >
                    Speech therapy is a common treatment for people who have
                    difficulty speaking. It can be used to help with a wide
                    variety of speech and language disorders, including
                    stuttering, dysarthria, and apraxia of speech.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isHeroInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="text-slate-600 text-lg leading-relaxed"
                  >
                    It helps improve communication skills and also help people
                    who have difficulty speaking due to stroke, brain injury, or
                    developmental delay.
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6"
              >
                <p className="text-gray-800 text-lg leading-relaxed text-center">
                  If you or anyone you know have trouble in expressing thoughts
                  and feelings or understanding and communicating what other
                  says. With the help of our Speech Language Pathologist (SLPs)
                  will conduct an assessment and follow up with Rx of any
                  communication and speech problems you may have.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl font-bold mb-4"
            >
              Take the next step with Tiny Steps Clinic
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto"
            >
              Book a consultation to begin your child's personalized Play
              Therapy journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="https://wa.me/919886062430"
                target="_blank"
                rel="noreferrer"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Book a Consultation</span>
                <ArrowRight size={20} />
              </a>
              <Link
                to="/contact"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/30"
              >
                <span>Contact Us</span>
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isCtaInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-purple-200 mt-6"
            >
              Happy child and therapist high five ✨
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Play
