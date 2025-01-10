import emailjs from "@emailjs/browser";

document.addEventListener("DOMContentLoaded", () => {
	// EmailJS 초기화
	emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

	// 폼 이벤트 등록
	document.getElementById("contact-form").addEventListener("submit", function (event) {
		event.preventDefault();

		// 현재 시간 문자열을 hidden 필드에 저장
		const now = new Date().toLocaleString();
		document.getElementById("send_time").value = now;

		// 개인정보 동의 체크 로직
		const privacyValue = document.querySelector('input[name="privacy"]:checked');
		if (!privacyValue || privacyValue.value !== "agree") {
			alert("개인정보에 동의하지 않으면 문의하실 수 없습니다.");
			return;
		}

		// EmailJS 전송
		emailjs
			.sendForm(
				import.meta.env.VITE_EMAILJS_SERVICE_ID, // service ID
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // template ID
				this
			)
			.then(
				() => {
					console.log("SUCCESS!");
					alert("send mail complete!!!");
				},
				(error) => {
					console.log("FAILED...", error);
					alert("send mail fail!!!");
				}
			);
	});
});
