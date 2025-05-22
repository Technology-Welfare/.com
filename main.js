// =============================================
// MOBILE MENU TOGGLE FUNCTIONALITY
// =============================================

/**
 * Toggles mobile navigation menu visibility
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  // Return early if elements don't exist
  if (!menuToggle || !navLinks) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = navLinks.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });
};


// =============================================
// DONATION FORM FUNCTIONALITY
// =============================================

/**
 * Initializes donation form functionality including:
 * - Form show/hide
 * - Amount selection
 * - Form submission
 */
const initDonationForm = () => {
  // DOM Elements
  const donateBtns = document.querySelectorAll('#donate-btn-hero, #donate-btn-nav, .cause-donate-btn');
  const donationForm = document.getElementById('donationForm');
  const closeForm = document.getElementById('closeForm');
  const amountOptions = document.querySelectorAll('.amount-option');
  const customAmountInput = document.querySelector('.custom-amount');
  const customOption = document.getElementById('custom-option');
  const formElement = document.getElementById('donationFormElement');
  const qrContainer = document.getElementById('qrcode-container');
  
  // Return early if essential elements don't exist
  if (!donationForm || !formElement) {
    console.warn('Donation form elements not found');
    return;
  }

  // ======================
  // FORM VISIBILITY CONTROL
  // ======================
  
  /**
   * Shows donation form and disables page scrolling
   */
  const showDonationForm = (e) => {
    if (e) e.preventDefault();
    donationForm.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  /**
   * Hides donation form and restores page scrolling
   */
  const hideDonationForm = () => {
    donationForm.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  // Add click handlers to all donation buttons
  donateBtns.forEach(btn => {
    btn.addEventListener('click', showDonationForm);
  });
  
  // Close form when X button is clicked
  if (closeForm) {
    closeForm.addEventListener('click', hideDonationForm);
  }
  
  // Close form when clicking outside the form content
  donationForm.addEventListener('click', (e) => {
    if (e.target === donationForm) {
      hideDonationForm();
    }
  });

  // ======================
  // AMOUNT SELECTION LOGIC
  // ======================
  
  /**
   * Handles amount selection from preset options or custom input
   */
  const handleAmountSelection = (selectedOption) => {
    // Remove active class from all options
    amountOptions.forEach(opt => opt.classList.remove('active'));
    
    // Mark selected option as active
    selectedOption.classList.add('active');
    
    // Handle custom amount selection
    if (selectedOption === customOption && customAmountInput) {
      customAmountInput.classList.add('active');
      customAmountInput.value = '';
      customAmountInput.focus();
      document.getElementById('amount').value = '';
    } else {
      if (customAmountInput) customAmountInput.classList.remove('active');
      document.getElementById('amount').value = selectedOption.dataset.amount;
    }
    
    // Check if we need to show QR code
    checkForQRCode();
  };
  
  // Add click handlers to amount options
  if (amountOptions.length) {
    amountOptions.forEach(option => {
      option.addEventListener('click', () => handleAmountSelection(option));
    });
  }
  
  // Handle custom amount input changes
  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      document.getElementById('amount').value = e.target.value;
      checkForQRCode();
    });
  }

  // ======================
  // QR CODE FUNCTIONALITY
  // ======================
  
  /**
   * Generates QR code for UPI payments
   * @param {number} amount - Donation amount
   */
  const generateQRCode = (amount) => {
    const qrcodeDiv = document.getElementById('qrcode');
    if (!qrcodeDiv) return;
    
    qrcodeDiv.innerHTML = ''; // Clear previous QR code
    
    // Replace with your actual UPI details
    const upiId = 'your-upi-id@upi'; // Example: '1234567890@upi'
    const payeeName = 'Your Organization Name';
    
    // Validate amount
    if (!amount || isNaN(amount)) {
      console.warn('Invalid amount for QR code generation');
      return;
    }
    
    // UPI payment URL format
    const upiUrl = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR`;
    
    // Generate QR Code (requires QRCode.js library)
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrcodeDiv, {
        text: upiUrl,
        width: 150,
        height: 150,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      console.error('QRCode library not loaded');
    }
  };
  
  /**
   * Checks if QR code should be displayed based on payment method and amount
   */
  const checkForQRCode = () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const paymentMethod = document.getElementById('payment').value;
    
    if (qrContainer) {
      if (paymentMethod === 'bank' && amount > 0) {
        generateQRCode(amount);
        qrContainer.style.display = 'block';
      } else {
        qrContainer.style.display = 'none';
      }
    }
  };
  
  // Handle payment method changes
  const paymentSelect = document.getElementById('payment');
  if (paymentSelect) {
    paymentSelect.addEventListener('change', checkForQRCode);
  }

  // ======================
  // FORM SUBMISSION LOGIC
  // ======================
  
  /**
   * Handles form submission and email confirmation
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const cause = document.getElementById('cause').value.trim() || 'General Donation';
    const paymentMethod = document.getElementById('payment').value;
    
    // Basic validation
    if (!name || !email || !amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate amount is a positive number
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    try {
      // In a real app, you would process payment here
      console.log('Donation details:', { name, email, amount, cause, paymentMethod });
      
      // Show success message
      alert(`Thank you, ${name}, for your donation of ₹${amount}! A confirmation will be sent to ${email}.`);
      
      // Send email confirmation if EmailJS is loaded
      if (typeof emailjs !== 'undefined') {
        await emailjs.send('service_byvqbi1', 'template_c5pcxas', {
          to_email: email,
          donor_name: name,
          amount: amount,
          cause: cause,
          date: new Date().toLocaleDateString(),
          payment_method: payment 
        });
      }
      
      // Reset form
      formElement.reset();
      hideDonationForm();
      
      // Reset amount options
      amountOptions.forEach(opt => opt.classList.remove('active'));
      if (customAmountInput) customAmountInput.classList.remove('active');
      if (qrContainer) qrContainer.style.display = 'none';
      
    } catch (error) {
      console.error('Donation processing error:', error);
      alert('There was an error processing your donation. Please try again.');
    }
  };
  
  // Add form submit handler
  formElement.addEventListener('submit', handleFormSubmit);
};


// =============================================
// SCROLL ANIMATION FUNCTIONALITY
// =============================================

/**
 * Animates elements when they come into view during scrolling
 */
const initScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('.cause-card, .stat-item');
  
  // Return early if no elements to animate
  if (animatedElements.length === 0) return;
  
  // Set initial state for all animated elements
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  /**
   * Checks element positions and triggers animations when in view
   */
  const checkAnimation = () => {
    const triggerPosition = window.innerHeight / 1.3;
    
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      
      if (elementPosition < triggerPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Check animations on scroll and page load
  window.addEventListener('scroll', checkAnimation);
  window.addEventListener('load', checkAnimation);
};


// =============================================
// INITIALIZE ALL FUNCTIONALITY
// =============================================

/**
 * Initializes all JavaScript functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDonationForm();
  initScrollAnimations();
  
  // Initialize EmailJS if available
  if (typeof emailjs !== 'undefined') {
    emailjs.init('QVbsVcgQGfT48qops');
  }
});