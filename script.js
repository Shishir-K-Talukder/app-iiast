// Function to update preview in real-time
function updatePreview() {
    const formInputs = {
        title: document.getElementById('title').value,
        course: document.getElementById('course').value,
        examYear: document.getElementById('examYear').value,
        courseCode: document.getElementById('courseCode').value,
        courseTitel: document.getElementById('courseTitel').value,
        studentId: document.getElementById('studentId').value,
        regNo: document.getElementById('regNo').value,
        session: document.getElementById('session').value,
        department: document.getElementById('department').value,
        institute: document.getElementById('institute').value
    };

    document.querySelector('.main-title').textContent = formInputs.title;
    document.querySelector('.course-name').textContent = formInputs.course;
    document.querySelector('.exam-title').textContent = `Practical Examination-${formInputs.examYear}`;
    document.getElementById('displayCourseCode').textContent = formInputs.courseCode;
    document.getElementById('displayCourseTitel').textContent = formInputs.courseTitel;
    document.getElementById('displayStudentId').textContent = formInputs.studentId;
    document.getElementById('displayRegNo').textContent = formInputs.regNo;
    document.getElementById('displaySession').textContent = formInputs.session;
    document.getElementById('displayDepartment').textContent = formInputs.department;
    document.getElementById('displayInstitute').textContent = formInputs.institute;
}

// Function to download image
function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to generate PDF
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const coverPage = document.getElementById('coverPage');
    
    // Show loading indicator
    const button = document.querySelector('.pdf-button');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    button.disabled = true;

    try {
        // Create a new PDF document
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Convert the cover page to canvas
        const canvas = await html2canvas(coverPage, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Get the dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add the image to PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        // Generate filename based on student info
        const studentId = document.getElementById('studentId').value || 'cover';
        const courseCode = document.getElementById('courseCode').value || '';
        const filename = `${studentId}_${courseCode}_cover.pdf`;

        // Save the PDF
        pdf.save(filename);

        // Show success message
        button.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    } catch (error) {
        console.error('Error generating PDF:', error);
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error! Try again';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            document.querySelector('.nav-item.active')?.classList.remove('active');
            item.classList.add('active');
        }
    });

    // Navigation tooltips
    const tooltipTexts = {
        'fa-home': 'Home',
        'fa-info-circle': 'About',
        'fa-cloud-arrow-down': 'Download',
        'fa-envelope': 'Contact'
    };

    navItems.forEach(item => {
        // Only prevent default for download button
        item.addEventListener('click', (e) => {
            if (item.classList.contains('download-btn')) {
                e.preventDefault();
                generatePDF();
            }
        });

        // Handle tooltips
        item.addEventListener('mouseenter', () => {
            const iconClass = Array.from(item.querySelector('i').classList)
                .find(cls => cls.startsWith('fa-'));
            const tooltip = document.querySelector('.nav-tooltip');
            if (tooltip && tooltipTexts[iconClass]) {
                tooltip.textContent = tooltipTexts[iconClass];
            }
        });
    });
});

// Add tooltips to navigation items
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Set tooltips for navigation items
    const tooltips = {
        'fa-home': 'Home',
        'fa-info-circle': 'About',
        'fa-file-pdf': 'Download PDF',
        'fa-print': 'Print Page',
        'fa-user': 'Profile',
        'fa-envelope': 'Contact'
    };

    navItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon) {
            for (const [className, tooltip] of Object.entries(tooltips)) {
                if (icon.classList.contains(className)) {
                    item.setAttribute('data-tooltip', tooltip);
                    break;
                }
            }
        }
    });

    // Handle print button click
    const printBtn = document.querySelector('.nav-item.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }

    // Handle download button click
    const downloadBtn = document.querySelector('.nav-item.download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof generatePDF === 'function') {
                generatePDF();
            }
        });
    }
});

// Profile page animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate stats counter
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + '+';
            }
        };
        updateCount();
    });

    // Animate skill items on scroll
    const skillItems = document.querySelectorAll('.skill-item');
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });

    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        });
        link.addEventListener('mouseout', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click animation to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Add event listeners to all input fields
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updatePreview);
});

// Initial preview update
window.addEventListener('load', updatePreview);
