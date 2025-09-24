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
  GraduationCap,
  Award,
} from 'lucide-react'

const Special = () => {
  const floatingElementsRef = useRef([])
  const heroRef = useRef(null)
  const benefitsRef = useRef(null)
  const challengesRef = useRef(null)
  const ctaRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isBenefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const isChallengesInView = useInView(challengesRef, {
    once: true,
    amount: 0.2,
  })
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

  const benefits = [
    'Personalized learning approaches',
    'Academic and behavioral support',
    'Builds confidence and motivation',
    'Individualized strategies',
    'Progress tracking and assessment',
    'Collaborative approach with family',
  ]

  const challenges = [
    'Learning difficulties or disabilities',
    'Attention and focus challenges',
    'Behavioral or emotional difficulties',
    'Academic performance concerns',
    'Social interaction challenges',
    'Need for specialized educational support',
  ]

  const expectations = [
    'Comprehensive assessment of learning needs',
    'Individualized education plan development',
    'Tailored teaching methods and strategies',
    'Regular progress monitoring',
    'Collaboration with teachers and parents',
    'Behavioral support and intervention',
    'Skill-building activities and exercises',
  ]

  const whoCanBenefit = [
    'Children with learning disabilities',
    'Kids with ADHD or attention difficulties',
    'Children with developmental delays',
    'Kids needing academic support',
    'Any child requiring personalized education strategies',
  ]

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
            <span className="text-purple-800 font-semibold">Our Services</span>
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
              Special Education Plan (SEP)
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-5xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  What is a Special Education Plan?
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  A Special Education Plan (SEP) provides personalized learning
                  strategies and support for children with unique learning
                  needs. It ensures tailored academic, behavioral, and
                  developmental guidance so every child can thrive.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-6 shadow-lg">
                  <GraduationCap className="w-24 h-24 text-yellow-600 mx-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          ref={benefitsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isBenefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
                Key Benefits of a Special Education Plan
              </span>
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-6 shadow-lg">
                  <Award className="w-24 h-24 text-yellow-600 mx-auto" />
                </div>
                <p className="text-center text-gray-600 mt-4 font-medium">
                  Personalized learning approaches
                </p>
              </div>
              <div>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isBenefitsInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle
                        className="text-yellow-500 flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it Works Section */}
        <motion.div
          ref={challengesRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isChallengesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              How Special Education Plan Works
            </h2>
            <div className="space-y-3 max-w-4xl mx-auto">
              {expectations.map((expectation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isChallengesInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-white/50 rounded-lg p-4"
                >
                  <CheckCircle
                    className="text-yellow-500 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">{expectation}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Helps in addressing below challenges */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={
            isChallengesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Helps in addressing below challenges
                </h2>
                <div className="space-y-3">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isChallengesInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle
                        className="text-green-500 flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-700">{challenge}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg">
                  <BookOpen className="w-24 h-24 text-amber-600 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who Can Benefit Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={
            isChallengesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-yellow-100 to-amber-100 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Who Can Benefit?
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {whoCanBenefit.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isChallengesInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-white/50 rounded-lg p-4"
                >
                  <CheckCircle
                    className="text-yellow-500 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isChallengesInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 mt-6"
              >
                <p className="text-gray-800 font-medium text-center">
                  At Tiny Steps, our Special Education Plans provide
                  personalized learning strategies and support to help every
                  child reach their full potential.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-3xl shadow-2xl p-8 text-white">
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
              className="text-yellow-100 text-lg mb-8 max-w-2xl mx-auto"
            >
              Book a consultation to begin your child's personalized Special
              Education journey.
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
                className="bg-white text-yellow-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              className="text-yellow-200 mt-6"
            >
              Happy child and therapist high five ✨
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Special
