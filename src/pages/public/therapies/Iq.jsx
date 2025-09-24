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
  Brain,
  Lightbulb,
  FileText,
} from 'lucide-react'
import {
  FaBrain,
  FaLightbulb,
  FaRocket,
  FaSchool,
  FaUsers,
  FaFileAlt,
  FaTasks,
  FaChartLine,
  FaFileSignature,
  FaComments,
} from 'react-icons/fa'

const Iq = () => {
  const floatingElementsRef = useRef([])
  const heroRef = useRef(null)
  const benefitsRef = useRef(null)
  const howWorksRef = useRef(null)
  const challengesRef = useRef(null)
  const expectationRef = useRef(null)
  const whoCanBenefitRef = useRef(null)
  const ctaRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isBenefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const isHowWorksInView = useInView(howWorksRef, { once: true, amount: 0.2 })
  const isChallengesInView = useInView(challengesRef, {
    once: true,
    amount: 0.2,
  })
  const isExpectationInView = useInView(expectationRef, {
    once: true,
    amount: 0.2,
  })
  const isWhoCanBenefitInView = useInView(whoCanBenefitRef, {
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
    {
      icon: FaBrain,
      title: 'Cognitive Profile',
      description:
        'Measures reasoning, memory, attention, and problem-solving skills.',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
    },
    {
      icon: FaLightbulb,
      title: 'Personalized Learning',
      description:
        'Supports tailored educational strategies and classroom accommodations.',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      icon: FaRocket,
      title: 'Giftedness Identification',
      description:
        'Recognizes advanced abilities for enrichment or acceleration programs.',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
    {
      icon: FaSchool,
      title: 'Supports IEP / 504 Plan',
      description:
        'Provides objective data for school-based interventions or accommodations.',
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      icon: FaUsers,
      title: 'Empowers Families & Educators',
      description:
        "Gives clarity on a child's potential and how best to nurture it.",
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
  ]

  const howItWorks = [
    {
      icon: FaFileAlt,
      title: 'Pre-Consultation',
      description:
        'Discussion with parents to understand goals and background.',
    },
    {
      icon: FaTasks,
      title: 'Standardized Testing',
      description:
        'Child completes cognitive tasks administered by a professional.',
    },
    {
      icon: FaChartLine,
      title: 'Scoring & Interpretation',
      description:
        'Results analyzed across various domains (verbal, non-verbal, processing, etc.).',
    },
    {
      icon: FaFileSignature,
      title: 'Comprehensive Report',
      description: 'Scores, insights, and tailored recommendations provided.',
    },
    {
      icon: FaComments,
      title: 'Feedback Session',
      description:
        'Review results and next steps with a psychologist or specialist.',
    },
  ]

  const challenges = [
    'Identifying giftedness or high potential',
    'Diagnosing intellectual disability or learning difficulties',
    'Clarifying attention, memory, or reasoning issues',
    'Informing educational support or placement decisions',
    'Supporting behavior or emotional development concerns',
  ]

  const expectations = [
    '1–2 hours of direct testing (age dependent)',
    'Quiet, comfortable, child-friendly testing environment',
    'Standardized, research-based tools (e.g., WISC, WPPSI)',
    'Personalized explanation of results',
    'Official documentation for schools or professionals',
  ]

  const whoCanBenefit = [
    'Children struggling with learning or academics',
    'Kids who may be gifted and need advanced learning paths',
    'Students with attention, memory, or reasoning difficulties',
    "Parents seeking clarity on their child's intellectual strengths",
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
              Intelligence Quotient (IQ) Testing
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
                  What is IQ Testing?
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  IQ Testing at Tiny Steps provides a reliable measure of your
                  child's cognitive strengths and challenges. This structured
                  assessment can guide personalized learning, identify
                  giftedness or learning needs, and support educational
                  planning.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
                  <Brain className="w-24 h-24 text-purple-600 mx-auto" />
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
                Key Benefits of IQ Testing
              </span>
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isBenefitsInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className={`bg-gradient-to-br ${benefit.bgColor} backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div
                  className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          ref={howWorksRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isHowWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
                How IQ Testing Works
              </span>
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isHowWorksInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-indigo-400 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Challenges Section */}
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
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
                  <Target className="w-24 h-24 text-purple-600 mx-auto" />
                </div>
                <p className="text-center text-gray-600 mt-4 font-medium">
                  Child engaged in IQ tasks
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Helps in Addressing Below Challenges
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
            </div>
          </div>
        </motion.div>

        {/* What to Expect Section */}
        <motion.div
          ref={expectationRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isExpectationInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  What to Expect from an IQ Testing Session?
                </h2>
                <div className="space-y-3">
                  {expectations.map((expectation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isExpectationInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle
                        className="text-blue-500 flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-700">{expectation}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6 shadow-lg">
                  <FileText className="w-24 h-24 text-blue-600 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who Can Benefit Section */}
        <motion.div
          ref={whoCanBenefitRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isWhoCanBenefitInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Who Can Benefit?
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {whoCanBenefit.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isWhoCanBenefitInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-white/50 rounded-lg p-4"
                >
                  <CheckCircle
                    className="text-purple-500 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isWhoCanBenefitInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6 mt-6"
              >
                <p className="text-gray-800 font-medium text-center">
                  Intelligence testing opens doors to understanding your child's
                  unique cognitive profile and potential.
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
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={
                isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl font-bold mb-4"
            >
              Gain Clarity, Confidence, and Support
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto"
            >
              Book an IQ Testing session at Tiny Steps Clinic today and take the
              next step toward understanding your child's potential.
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
                <span>Book a Session</span>
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

export default Iq
