import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { gsap } from 'gsap'
import { Link } from '@tanstack/react-router'
import {
  Heart,
  Star,
  Sparkles,
  Brain,
  Users,
  Target,
  Zap,
  Smile,
  Activity,
  BookOpen,
  Music,
  Waves,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  GraduationCap,
  Laptop,
  School,
} from 'lucide-react'

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeService, setActiveService] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Function to map service IDs to therapy page routes
  const getTherapyPageRoute = (serviceId) => {
    const routeMapping = {
      speech: '/therapies/speech',
      'applied-behavior': '/therapies/applied',
      occupational: '/therapies/occupational',
      aqua: '/therapies/aqua',
      behavioral: '/therapies/behavioral',
      group: '/therapies/group',
      language: '/therapies/language',
      music: '/therapies/music',
      physiotherapy: '/therapies/physio',
      'special-education': '/therapies/special',
      sensory: '/therapies/sensory',
      'online-intervention': '/therapies/online',
      'asd-screening': '/therapies/asdscreening',
      diagnosis: '/therapies/diagnosis',
      'developmental-screening': '/therapies/development',
      'iq-testing': '/therapies/iq',
      'academic-skills': '/therapies/academic',
      'after-school': '/therapies/after',
      'early-intervention': '/therapies/earlyinter',
      'school-readiness': '/therapies/school',
    }
    return routeMapping[serviceId] || null
  }

  const floatingElementsRef = useRef([])
  const heroRef = useRef(null)
  const servicesRef = useRef(null)
  const ctaRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isServicesInView = useInView(servicesRef, { once: true, amount: 0.2 })
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

  const services = [
    {
      id: 'speech',
      title: 'Speech Therapy',
      description:
        'Enhances speech clarity & communication skills through personalized intervention.',
      fullDescription:
        'Focuses on developing understanding and use of language, improving expressive and receptive skills for clear communication.',
      icon: Brain,
      emoji: '🗣️',
      category: 'therapy',
      benefits: [
        'Improves speech clarity and articulation',
        'Enhances vocabulary and language skills',
        'Supports social interaction and communication',
        'Builds confidence in speaking',
      ],
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      id: 'applied-behavior',
      title: 'Applied Behavior Analysis (ABA)',
      description:
        'Understanding behavior and teaching new skills through positive reinforcement',
      fullDescription:
        'ABA therapy focuses on breaking down complex tasks into smaller, manageable steps, helping children learn at their own pace.',
      icon: Brain,
      emoji: '🧩',
      category: 'therapy',
      benefits: [
        'Improves learning and behavior skills',
        'Evidence-based intervention',
        'Systematic skill development',
        'Reduces challenging behaviors',
      ],
      color: 'from-violet-400 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100',
    },
    {
      id: 'occupational',
      title: 'Occupational Therapy',
      description:
        'Builds daily living skills & independence through structured activities.',
      fullDescription:
        'Helps children develop skills for daily living, learning, and playing, focusing on fine motor skills, sensory processing, and coordination.',
      icon: Target,
      emoji: '🛠️',
      category: 'therapy',
      benefits: [
        'Enhances fine and gross motor skills',
        'Improves focus and attention',
        'Supports independence in daily activities',
        'Strengthens hand-eye coordination',
      ],
      color: 'from-green-400 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    {
      id: 'aqua',
      title: 'Aqua Therapy',
      description:
        'Exercise-based therapy in water for improved movement and confidence.',
      fullDescription:
        'Uses water-based exercises to improve physical strength, mobility, and sensory experiences.',
      icon: Waves,
      emoji: '💧',
      category: 'therapy',
      benefits: [
        'Improves motor skills in supportive environment',
        'Enhances balance and coordination',
        'Supports sensory regulation',
        'Boosts confidence and relaxation',
      ],
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Therapy',
      description:
        'Supports positive behaviors & reduces challenges through structured strategies.',
      fullDescription:
        'Focuses on understanding, managing, and improving behaviors through evidence-based interventions.',
      icon: Smile,
      emoji: '💡',
      category: 'therapy',
      benefits: [
        'Improves emotional regulation',
        'Reduces challenging behaviors',
        'Enhances social skills',
        'Builds problem-solving abilities',
      ],
      color: 'from-blue-400 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      id: 'group',
      title: 'Group Therapy',
      description:
        'Encourages social interaction & peer learning in group settings.',
      fullDescription:
        'Provides opportunities for social skill development and peer interaction in structured group activities.',
      icon: Users,
      emoji: '👥',
      category: 'therapy',
      benefits: [
        'Develops social skills',
        'Encourages peer interaction',
        'Builds communication abilities',
        'Supports group dynamics',
      ],
      color: 'from-teal-400 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100',
    },
    {
      id: 'language',
      title: 'Language Therapy',
      description: 'Improves speech & language for better communication.',
      fullDescription:
        'Focuses on developing language comprehension, expression, and communication skills across all developmental areas.',
      icon: MessageSquare,
      emoji: '🗣️',
      category: 'therapy',
      benefits: [
        'Enhanced language comprehension',
        'Improved expressive communication',
        'Better social communication',
        'Increased vocabulary development',
      ],
      color: 'from-rose-400 to-rose-600',
      bgColor: 'from-rose-50 to-rose-100',
    },
    {
      id: 'music',
      title: 'Music & Art Therapy',
      description:
        'Boosts creativity, emotions, and expression through artistic activities.',
      fullDescription:
        'Uses creative arts to support emotional expression, cognitive development, and social skills.',
      icon: Music,
      emoji: '🎵',
      category: 'therapy',
      benefits: [
        'Enhances creative expression',
        'Supports emotional regulation',
        'Improves cognitive skills',
        'Encourages social interaction',
      ],
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
    },
    {
      id: 'physiotherapy',
      title: 'Physiotherapy',
      description:
        'Improves strength, balance & coordination through physical exercises.',
      fullDescription:
        'Focuses on improving physical strength, mobility, balance, and gross motor development.',
      icon: Activity,
      emoji: '🏃',
      category: 'therapy',
      benefits: [
        'Improves gross motor skills',
        'Enhances balance and coordination',
        'Strengthens muscle tone',
        'Supports physical development',
      ],
      color: 'from-orange-400 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
    },
    {
      id: 'special-education',
      title: 'Special Education Plan',
      description: 'Tailored education program for unique learning needs.',
      fullDescription:
        'Provides personalized learning strategies and support for children with unique learning needs.',
      icon: BookOpen,
      emoji: '📘',
      category: 'therapy',
      benefits: [
        'Personalized learning approaches',
        'Academic and behavioral support',
        'Builds confidence and motivation',
        'Individualized strategies',
      ],
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
    },
    {
      id: 'sensory',
      title: 'Sensory Integration Therapy',
      description: 'Helps children manage sensory inputs & improve focus.',
      fullDescription:
        'Helps children process and respond to sensory information more effectively.',
      icon: Zap,
      emoji: '🖐️',
      category: 'therapy',
      benefits: [
        'Improves sensory processing',
        'Enhances focus and attention',
        'Reduces sensory overload',
        'Builds sensory tolerance',
      ],
      color: 'from-pink-400 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
    },
    {
      id: 'online-intervention',
      title: 'Online Intervention Program',
      description: 'Therapy & learning via online sessions.',
      fullDescription:
        'Convenient online therapy sessions providing professional intervention and support from the comfort of your home.',
      icon: Laptop,
      emoji: '💻',
      category: 'therapy',
      benefits: [
        'Convenient home-based therapy',
        'Flexible scheduling options',
        'Professional online support',
        'Accessible therapy services',
      ],
      color: 'from-slate-400 to-slate-600',
      bgColor: 'from-slate-50 to-slate-100',
    },
    {
      id: 'asd-screening',
      title: 'ASD Screening',
      description:
        'Early identification of autism spectrum disorder through comprehensive assessment.',
      fullDescription:
        'Professional evaluation for early identification of autism spectrum characteristics.',
      icon: Search,
      emoji: '🧠',
      category: 'assessment',
      benefits: [
        'Early identification and intervention',
        'Comprehensive developmental assessment',
        'Professional evaluation',
        'Guidance for next steps',
      ],
      color: 'from-purple-400 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis',
      description:
        'Professional evaluation for developmental challenges and disorders.',
      fullDescription:
        'Comprehensive diagnostic evaluation to identify developmental challenges and create treatment plans.',
      icon: CheckCircle,
      emoji: '📋',
      category: 'assessment',
      benefits: [
        'Accurate diagnostic evaluation',
        'Comprehensive assessment',
        'Treatment planning',
        'Professional guidance',
      ],
      color: 'from-red-400 to-red-600',
      bgColor: 'from-red-50 to-red-100',
    },
    {
      id: 'developmental-screening',
      title: 'Developmental Screening',
      description: 'Tracking growth milestones and early detection.',
      fullDescription:
        'Comprehensive screening to monitor developmental progress and identify areas that may need additional support.',
      icon: Search,
      emoji: '📊',
      category: 'assessment',
      benefits: [
        'Early milestone tracking',
        'Comprehensive development review',
        'Identifies support needs',
        'Monitors progress over time',
      ],
      color: 'from-amber-400 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
    },
    {
      id: 'iq-testing',
      title: 'IQ Testing',
      description: 'Measuring cognitive skills and intelligence levels.',
      fullDescription:
        'Professional cognitive assessment to evaluate intellectual abilities and identify strengths and areas for development.',
      icon: Brain,
      emoji: '🧩',
      category: 'assessment',
      benefits: [
        'Comprehensive cognitive evaluation',
        'Identifies intellectual strengths',
        'Guides intervention planning',
        'Professional assessment',
      ],
      color: 'from-fuchsia-400 to-fuchsia-600',
      bgColor: 'from-fuchsia-50 to-fuchsia-100',
    },
    {
      id: 'academic-skills',
      title: 'Academic Skill Deficit Program',
      description: 'Supports children with academic learning needs.',
      fullDescription:
        'Specialized program to address learning challenges and support academic skill development in various subjects.',
      icon: GraduationCap,
      emoji: '📚',
      category: 'education',
      benefits: [
        'Addresses learning challenges',
        'Improves academic performance',
        'Builds learning strategies',
        'Enhances study skills',
      ],
      color: 'from-lime-400 to-lime-600',
      bgColor: 'from-lime-50 to-lime-100',
    },
    {
      id: 'after-school',
      title: 'After School Club',
      description: 'Learning and fun activities after school hours.',
      fullDescription:
        'Structured after-school program combining therapeutic activities with fun learning experiences in a social setting.',
      icon: Clock,
      emoji: '🎒',
      category: 'education',
      benefits: [
        'Structured after-school support',
        'Social skill development',
        'Fun learning activities',
        'Therapeutic reinforcement',
      ],
      color: 'from-sky-400 to-sky-600',
      bgColor: 'from-sky-50 to-sky-100',
    },
    {
      id: 'early-intervention',
      title: 'Early Intervention Program',
      description: 'Support for children in early years development.',
      fullDescription:
        'Comprehensive early intervention services for children aged 0-6 years to support optimal development.',
      icon: Star,
      emoji: '🌱',
      category: 'education',
      benefits: [
        'Early developmental support',
        'Family-centered approach',
        'Prevents future challenges',
        'Optimizes development',
      ],
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
    },
    {
      id: 'school-readiness',
      title: 'School Readiness Program',
      description: 'Preparing children for structured school learning.',
      fullDescription:
        'Comprehensive program to prepare children for the academic and social demands of formal schooling.',
      icon: School,
      emoji: '🏫',
      category: 'education',
      benefits: [
        'Prepares for school environment',
        'Develops pre-academic skills',
        'Builds social readiness',
        'Smooth school transition',
      ],
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
    },
  ]

  const categories = [
    { id: 'all', name: 'All Services', icon: Star },
    { id: 'therapy', name: 'Therapy Services', icon: Heart },
    { id: 'assessment', name: 'Assessment Services', icon: Search },
    { id: 'education', name: 'General Services', icon: BookOpen },
  ]

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
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
          className="absolute bottom-60 right-16 text-purple-200  z-60"
        >
          <Brain size={80} />
        </div>
        <div
          ref={(el) => (floatingElementsRef.current[4] = el)}
          className="absolute bottom-40 left-20 text-pink-200 z-60"
        >
          <Smile size={80} />
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
              Comprehensive Care for
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Every Child's Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-slate-600 text-xl max-w-4xl mx-auto leading-relaxed font-medium mb-12"
          >
            From speech therapy to behavioral support, our expert team provides
            personalized interventions designed to help your child reach their
            full potential in a nurturing, play-based environment.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md'
              }`}
            >
              <category.icon size={18} />
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          ref={servicesRef}
          initial={{ opacity: 0, y: 60 }}
          animate={
            isServicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-24"
        >
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-gradient-to-br ${service.bgColor} backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 cursor-pointer`}
                  onClick={() =>
                    setActiveService(
                      activeService === service.id ? null : service.id,
                    )
                  }
                >
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl">{service.emoji}</span>
                    </div>
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}
                    >
                      <service.icon size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Service Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {activeService === service.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/30 pt-6 mb-6">
                          <p className="text-gray-700 mb-4 font-medium">
                            {service.fullDescription}
                          </p>

                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-600" />
                            Key Benefits:
                          </h4>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-gray-600"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    {/* Learn More / Show Less Button */}
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                    >
                      {activeService === service.id
                        ? 'Show Less'
                        : 'Learn More'}
                      <ArrowRight
                        size={16}
                        className={`transition-transform ${activeService === service.id ? 'rotate-90' : ''}`}
                      />
                    </motion.button>

                    {/* Know More Button with routing - Only show when expanded */}
                    {getTherapyPageRoute(service.id) &&
                      activeService === service.id && (
                        <Link to={getTherapyPageRoute(service.id)}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`bg-gradient-to-r ${service.color} text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Know More
                            <ArrowRight size={14} />
                          </motion.button>
                        </Link>
                      )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No Services Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.section
          ref={ctaRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Start Your Child's Therapy Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Our team of certified professionals is here to support your
                child's development with personalized care and evidence-based
                interventions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link
                    to="/contact"
                    className="flex items-center gap-2"
                    scroll={false}
                  >
                    <Clock size={18} />
                    Schedule Free Consultation
                  </Link>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  Call Us: +91 98860 62430
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Flexible Scheduling
            </h3>
            <p className="text-gray-600">
              We offer flexible appointment times to fit your family's schedule,
              including evenings and weekends.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Family-Centered Care
            </h3>
            <p className="text-gray-600">
              We involve families in every step of the therapy process,
              providing training and support at home.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Evidence-Based
            </h3>
            <p className="text-gray-600">
              All our therapies are grounded in the latest research and proven
              methodologies for optimal outcomes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Services
