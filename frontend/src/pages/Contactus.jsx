import React from 'react'

const Contactus = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <form className="bg-white rounded-lg shadow p-8 space-y-4">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea placeholder="Message" rows="5" className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contactus
