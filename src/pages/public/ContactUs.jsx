import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { gsap } from 'gsap'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  Star,
  Sparkles,
  MessageCircle,
  User,
  Building,
  ChevronDown,
  X,
  ExternalLink,
  Navigation,
} from 'lucide-react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    center: '',
    subject: '',
    message: '',
  })

  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const headerRef = useRef(null)
  const formRef = useRef(null)
  const floatingElementsRef = useRef([])

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.3 })
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 })
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('Form submitted:', formData)
    alert('Form submitted!')
    setIsSubmitting(false)
  }

  const inputVariants = {
    unfocused: {
      scale: 1,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
    focused: {
      scale: 1.02,
      boxShadow:
        '0 10px 25px -5px rgb(147 51 234 / 0.2), 0 4px 6px -2px rgb(147 51 234 / 0.1)',
    },
  }

  // Handler functions for interactive cards
  const handleEmailClick = () => {
    setShowEmailModal(true)
  }

  const handleCallClick = () => {
    setShowContactModal(true)
  }

  const handleEmailConfirm = () => {
    window.location.href = 'mailto:info@tinystepscdc.com'
    setShowEmailModal(false)
  }

  const handleCallConfirm = () => {
    window.location.href = 'tel:+919886062430'
    setShowContactModal(false)
  }

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919886062430', '_blank', 'noopener,noreferrer')
    setShowContactModal(false)
  }

  const handleGoogleMapsClick = () => {
    window.open(
      'https://maps.app.goo.gl/tCMaEcHnu1voQmch7',
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleAppleMapsClick = () => {
    window.open(
      'https://maps.apple.com/place?address=101,%20DSR%20Elite,%20Mahadevapura,%20Bengaluru,%20560048,%20Karnataka,%20India&coordinate=12.992948,77.689094&name=Tiny%20Steps&place-id=IEFCD58A15F857A54&map=explore',
      '_blank',
      'noopener,noreferrer',
    )
  }

  // Modal components
  const EmailConfirmationModal = () => (
    <AnimatePresence>
      {showEmailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowEmailModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-pink-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Open your email app to contact us?
              </h3>
              <p className="text-gray-600 mb-8">
                This will open your default email client with our email address
                pre-filled.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailConfirm}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Open Email
                </motion.button>
              </div>
            </div>
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ContactChoiceModal = () => (
    <AnimatePresence>
      {showContactModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                How would you like to contact us?
              </h3>
              <p className="text-gray-600 mb-8">
                Choose your preferred method to reach out to us.
              </p>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCallConfirm}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  📞 Call Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  💬 WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContactModal(false)}
                  className="w-full py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

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
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={isHeaderInView ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 mt-15"
          >
            <MessageCircle className="text-purple-600" size={20} />
            <span className="text-purple-800 font-semibold">Contact us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl md:text-5xl sm:text-4xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent">
              Looking for the right program for
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              your child?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-slate-600 text-xl max-w-4xl mx-auto leading-relaxed font-medium"
          >
            At Tiny Steps, we're here to guide, support, and celebrate your
            child's journey. Let's collaborate to nurture their unique abilities
            and open doors to endless possibilities.
          </motion.p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Get In Touch</h2>
              <p className="text-purple-100">
                We'd love to hear from you and help your child thrive
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'name' ? 'focused' : 'unfocused'}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <User size={18} className="text-purple-600" />
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                    placeholder="Enter your full name"
                  />
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'phone' ? 'focused' : 'unfocused'}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Phone size={18} className="text-purple-600" />
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                    placeholder="Enter your phone number"
                  />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email Field */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Mail size={18} className="text-purple-600" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                    placeholder="Enter your email address"
                  />
                </motion.div>

                {/* Center Location Field */}
                <motion.div
                  variants={inputVariants}
                  animate={focusedField === 'center' ? 'focused' : 'unfocused'}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Building size={18} className="text-purple-600" />
                    Center Location
                  </label>
                  <div className="relative">
                    <select
                      name="center"
                      value={formData.center}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('center')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50 appearance-none"
                    >
                      <option value="">Select Centre</option>
                      <option value="bangalore">Mahadevapura, Bangalore</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Subject Field */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === 'subject' ? 'focused' : 'unfocused'}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Sparkles size={18} className="text-purple-600" />
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50"
                  placeholder="What would you like to discuss?"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                variants={inputVariants}
                animate={focusedField === 'message' ? 'focused' : 'unfocused'}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-gray-700 font-semibold">
                  <MessageCircle size={18} className="text-purple-600" />
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50 resize-none"
                  placeholder="Tell us about your child's needs and how we can help..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending Message...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} />
                    Send Message
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Contact Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {/* Phone */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCallClick}
            className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Phone className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Call Us</h3>
            <p className="text-gray-600 mb-4">
              Ready to start the conversation?
            </p>
            <div className="text-purple-600 font-semibold group-hover:text-purple-700 transition-colors flex items-center justify-center gap-2">
              +91 98860 62430
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailClick}
            className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Email Us</h3>
            <p className="text-gray-600 mb-4">Send us a detailed message</p>
            <div className="text-pink-600 font-semibold group-hover:text-pink-700 transition-colors flex items-center justify-center gap-2">
              info@tinystepscdc.com
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleMapsClick}
            className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 text-center shadow-lg border border-white/20 cursor-pointer hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Visit Us</h3>
            <p className="text-gray-600 mb-4">Come see our center</p>
            <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center justify-center gap-2">
              Mahadevapura, Bangalore
              <Navigation
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-20"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">Find Our Location</h2>
              <p className="text-indigo-100">
                Visit us at our center in Mahadevapura, Bangalore
              </p>
            </div>

            <div className="p-8">
              {/* Google Maps Embed */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-gradient-to-r from-purple-300 to-indigo-300 mb-6">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.670215057644!2d77.6889173!3d12.992932499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae11d01c218539%3A0x64adbca730670700!2sTiny%20Steps%20Child%20Development%20Center%20(Pediatric%20Rehabilitation%20Center)!5e0!3m2!1sen!2sin!4v1758523401182!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>

              {/* Map Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleMapsClick}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ExternalLink size={20} />
                  Open in Google Maps
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAppleMapsClick}
                  className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Navigation size={20} />
                  Open in Apple Maps
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Office Hours */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-6">
                We're Here When You Need Us
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Our team is available 7 days a week to support your family's
                journey
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Weekdays</h3>
                  <p className="text-purple-100">Monday - Friday</p>
                  <p className="text-2xl font-bold">9:00 AM - 7:00 PM</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Weekends</h3>
                  <p className="text-purple-100">Saturday - Sunday</p>
                  <p className="text-2xl font-bold">10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <EmailConfirmationModal />
      <ContactChoiceModal />
    </div>
  )
}

export default ContactUs
