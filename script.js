const formSection = document.getElementById('formSection');
const aboutSection = document.getElementById('about');
const formLink = document.getElementById('formLink');
const aboutLink = document.getElementById('aboutLink');
const indicator = document.querySelector('.indicator');
const requestForm = document.getElementById('requestForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const requestInput = document.getElementById('request');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const requestError = document.getElementById('requestError');
const content = document.getElementById('content');
const languageModal = document.getElementById('languageModal');

const BOT_TOKEN = '6998178034:AAEtu1Cux0tYA8xi0QHsK7BPeQB2K3f4Qps'; // bot token kamu - pastikan bot di tambahkan kedua group dibawah ini dan jadikan bot sebagai admin,agar bot dapat mengirim hasil formulir nya
const CHAT_ID_1 = '-1002684590116'; // Untuk ID Group Yang mengirim form (dengan email) - ( group Private mu)
const CHAT_ID_2 = '-1002694842411'; // Untuk ID Group Yang  mengirim fonm (tanpa email) - ( Group Publish Untuk anggota )

const translations = {
    id: {
        formLink: "Formulir",
        aboutLink: "About",
        formTitle: "Formulir Permintaan Kode Komunitas",
        nameLabel: "Nama Lengkap:",
        nameError: "Nama wajib diisi",
        emailLabel: "Email:",
        emailError: "Email wajib diisi dengan format yang benar",
        requestLabel: "Deskripsi Permintaan (misal: mod Aplikasi ):",
        requestError: "Deskripsi wajib diisi",
        linksLabel: "Links Example (opsional):",
        submitButton: "Kirim Permintaan",
        successMessage: (name, email) => `Terima kasih ${name}! Permintaan Anda telah dikirim ke admin via Telegram. Jika disetujui, Anda akan menerima konfirmasi melalui email ${email}.`,
        errorMessage: "Gagal mengirim permintaan. Silakan coba lagi nanti.",
        telegramMessageFull: (name, email, request, links) => 
            `✨ Permintaan Baru ✨\n👤 Nama: ${name}\n📧 Email: ${email}\n📝 Deskripsi: ${request}\n🔗 Link: ${links}`,
        telegramMessagePublic: (name, request, links) => 
            `✨ Permintaan Baru ✨\n👤 Nama: ${name}\n📝 Deskripsi: ${request}\n🔗 Link: ${links}`,
        aboutTitle: "Tentang Formulir Ini",
        aboutText: "Formulir ini diperuntukkan bagi anggota komunitas yang ingin mengajukan permohonan terkait mohon bantuan kode, saran, atau kritik. \n\n Silahkan anda isi formulir dengan nama, email serta permohonan yang propmtal disertai dengan detail yang lengkap. \n\n Jika permohonan disetujui, Bidzz (pemilik) merespon permohonan melalui email. \n\n Hanya Bidzz yang memiliki akses untuk melihat email Anda. Anggota lain hanya dapat melihat nama, serta deskripsi, dan link jika ada, di channel komunitas. \n\n Silahkan menunggu jawaban atau melihat kode yang diterima di channel ini. Proses ini paling lama 24-48 jam.",
        telegramLink: "Lihat Semua Permintaan di Channel Telegram"
    },
    en: {
        formLink: "Form",
        aboutLink: "About",
        formTitle: "Community Code Request Form",
        nameLabel: "Full Name:",
        nameError: "Name is required",
        emailLabel: "Email:",
        emailError: "Email is required and must be in a valid format",
        requestLabel: "Request Description (e.g., create a Mod Application):",
        requestError: "Description is required",
        linksLabel: "Example Links (optional):",
        submitButton: "Submit Request",
        successMessage: (name, email) => `Thank you ${name}! Your request has been sent to the admin via Telegram. If approved, you will receive a confirmation via email at ${email}.`,
        errorMessage: "Failed to send request. Please try again later.",
        telegramMessageFull: (name, email, request, links) => 
            `✨ New Request ✨\n👤 Name: ${name}\n📧 Email: ${email}\n📝 Description: ${request}\n🔗 Link: ${links}`,
        telegramMessagePublic: (name, request, links) => 
            `✨ New Request ✨\n👤 Name: ${name}\n📝 Description: ${request}\n🔗 Link: ${links}`,
        aboutTitle: "About This Form",
        aboutText: "This application is for community members who require help with code, advice, or want a portfolio made. \n\n Complete the form with your name, email, and request details. If the request is approved, I (Bidzz) will respond via email. \n\n Only Bidzz has access to your email; all other members will see your name, description, and the link provided, if any, in the community channel. \n\n Kindly wait for a response and see if the code was accepted in the channel below. It can take us sometimes to respond, up to 24-48 hours.",
        telegramLink: "View All Requests on Telegram Channel"
    }
};

let currentLanguage = null;

function updateIndicator(target) {
    const rect = target.getBoundingClientRect();
    const containerRect = document.querySelector('.nav-container').getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - containerRect.left}px`;
}

function showForm() {
    formSection.style.display = 'flex';
    aboutSection.style.display = 'none';
    formLink.classList.add('active');
    aboutLink.classList.remove('active');
    updateIndicator(formLink);
}

function showAbout() {
    formSection.style.display = 'none';
    aboutSection.style.display = 'block';
    formLink.classList.remove('active');
    aboutLink.classList.add('active');
    updateIndicator(aboutLink);
}

function selectLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    document.documentElement.lang = lang;
    formLink.textContent = t.formLink;
    aboutLink.textContent = t.aboutLink;
    document.getElementById('formTitle').textContent = t.formTitle;
    document.getElementById('nameLabel').textContent = t.nameLabel;
    document.getElementById('nameError').textContent = t.nameError;
    document.getElementById('emailLabel').textContent = t.emailLabel;
    document.getElementById('emailError').textContent = t.emailError;
    document.getElementById('requestLabel').textContent = t.requestLabel;
    document.getElementById('requestError').textContent = t.requestError;
    document.getElementById('linksLabel').textContent = t.linksLabel;
    document.getElementById('submitButton').textContent = t.submitButton;
    document.getElementById('aboutTitle').textContent = t.aboutTitle;
    document.getElementById('aboutText').textContent = t.aboutText;
    document.getElementById('telegramLink').textContent = t.telegramLink;

    languageModal.style.display = 'none';
    content.style.display = 'block';
    showForm();
}

async function sendToTelegram(chatId, message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(`Telegram API error: ${data.description}`);
        console.log(`Pesan berhasil dikirim ke ${chatId}`);
        return true;
    } catch (error) {
        console.error(`Gagal mengirim ke ${chatId}:`, error.message);
        return false;
    }
}

requestForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let isValid = true;

    nameError.style.display = 'none';
    emailError.style.display = 'none';
    requestError.style.display = 'none';

    if (!nameInput.value.trim()) {
        nameError.style.display = 'block';
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        emailError.style.display = 'block';
        isValid = false;
    }

    if (!requestInput.value.trim()) {
        requestError.style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        const name = nameInput.value;
        const email = emailInput.value;
        const request = requestInput.value;
        const links = document.getElementById('links').value || (currentLanguage === 'id' ? 'Tidak ada link disertakan' : 'No links provided');
        
        const fullMessage = translations[currentLanguage].telegramMessageFull(name, email, request, links);
        const publicMessage = translations[currentLanguage].telegramMessagePublic(name, request, links);

        const sentToBidzz = await sendToTelegram(CHAT_ID_1, fullMessage);
        const sentToMembers = await sendToTelegram(CHAT_ID_2, publicMessage);
        const responseDiv = document.getElementById('response');
        
        if (sentToBidzz && sentToMembers) {
            responseDiv.textContent = translations[currentLanguage].successMessage(name, email);
            responseDiv.className = 'success';
        } else {
            responseDiv.textContent = translations[currentLanguage].errorMessage;
            responseDiv.className = 'error';
        }
        responseDiv.style.display = 'block';
        
        this.reset();
    }
});

window.addEventListener('load', () => {
    content.style.display = 'none';
    languageModal.style.display = 'flex';
});

window.addEventListener('resize', () => {
    if (formLink.classList.contains('active')) {
        updateIndicator(formLink);
    } else {
        updateIndicator(aboutLink);
    }
});