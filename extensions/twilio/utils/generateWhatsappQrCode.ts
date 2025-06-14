import QRCode from 'qrcode'

export const generateWhatsappQrCode = async(phone: String, message: String) => {
    // https://wa.me/<e164 number>&text=Hello!
    const waUrl = `https://wa.me/${phone}?text=${message}`
    return await QRCode.toDataURL(encodeURI(waUrl))
}