/**
 * PHP Email Form Validation - v3.9
 * URL: https://bootstrapmade.com/php-email-form/
 * Author: BootstrapMade.com
 */
(function () {
	"use strict";

	let forms = document.querySelectorAll(".php-email-form");

	forms.forEach(function (e) {
		e.addEventListener("submit", function (event) {
			event.preventDefault();

			let thisForm = this;

			let action = thisForm.getAttribute("action"); // "forms/contact.php"
			let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

			if (!action) {
				displayError(thisForm, "The form action property is not set!");
				return;
			}

			thisForm.querySelector(".loading").classList.add("d-block");
			thisForm.querySelector(".error-message").classList.remove("d-block");
			thisForm.querySelector(".sent-message").classList.remove("d-block");

			// [변경됨] 커스텀 폼 검증 함수 호출
			// 새로 추가된 brand, phone, privacy 등의 유효성 검사
			if (!customFormValidation(thisForm)) {
				// 유효성 검증 실패 시 처리 중단
				thisForm.querySelector(".loading").classList.remove("d-block");
				return;
			}

			let formData = new FormData(thisForm);

			if (recaptcha) {
				if (typeof grecaptcha !== "undefined") {
					grecaptcha.ready(function () {
						try {
							grecaptcha.execute(recaptcha, { action: "php_email_form_submit" }).then((token) => {
								formData.set("recaptcha-response", token);
								php_email_form_submit(thisForm, action, formData);
							});
						} catch (error) {
							displayError(thisForm, error);
						}
					});
				} else {
					displayError(thisForm, "The reCaptcha javascript API url is not loaded!");
				}
			} else {
				// ---------------  contact.php로 입력 내용 전달 ---------------
				php_email_form_submit(thisForm, action, formData);
			}
		});
	});

	// [변경됨] 커스텀 검증 로직 추가
	// brand, phone, privacy 라디오 버튼 등을 검사
	function customFormValidation(thisForm) {
		// 예: 브랜드 선택 필드
		const brand = thisForm.querySelector('select[name="brand"]');
		// 예: 전화번호 필드
		const phone = thisForm.querySelector('input[name="phone"]');
		// 예: 개인정보 동의 라디오
		const privacyAgree = thisForm.querySelector('input[name="privacy"][value="agree"]');
		const privacyDisagree = thisForm.querySelector('input[name="privacy"][value="disagree"]');

		// 1) 브랜드 선택 여부
		if (brand && !brand.value.trim()) {
			displayError(thisForm, "브랜드를 선택해주세요.");
			return false;
		}

		// 2) 전화번호 간단 패턴 검사 (숫자/하이픈/공백 정도 허용)
		if (phone && phone.value.trim()) {
			// 간단 예시: 최소 7글자 이상, 숫자/하이픈/공백만 허용
			const phoneRegex = /^[0-9-\s]{7,}$/;
			if (!phoneRegex.test(phone.value.trim())) {
				displayError(thisForm, "전화번호 형식이 올바르지 않습니다.");
				return false;
			}
		} else if (phone) {
			// 필수인데 아예 입력이 없다면
			displayError(thisForm, "전화번호를 입력해주세요.");
			return false;
		}

		// 3) 개인정보 동의 (둘 중 하나는 선택이 되어야 함, 보통은 'agree' 필수)
		//    여기서는 '동의합니다'가 필수라고 가정
		if (privacyAgree && privacyDisagree) {
			// 'privacy' 라디오 중 하나가 체크되어야 하는 구조라면
			if (!privacyAgree.checked && !privacyDisagree.checked) {
				displayError(thisForm, "개인정보 수집 및 이용에 동의 여부를 선택해주세요.");
				return false;
			}
			// 만약 'agree'를 반드시 체크해야만 제출 가능하게 하려면:
			// if(!privacyAgree.checked) {
			//   displayError(thisForm, "개인정보 수집 및 이용에 동의해야 문의가 가능합니다.");
			//   return false;
			// }
		}

		// 위 조건들을 모두 통과하면 true
		return true;
	}

	/*---------------  contact.php로 입력 내용 전달 (기존 구조) ------------------------*/
	function php_email_form_submit(thisForm, action, formData) {
		fetch(action, {
			method: "POST",
			body: formData,
			headers: { "X-Requested-With": "XMLHttpRequest" },
		})
			.then((response) => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error(`${response.status} ${response.statusText} ${response.url}`);
				}
			})
			.then((data) => {
				thisForm.querySelector(".loading").classList.remove("d-block");
				if (data.trim() == "OK") {
					thisForm.querySelector(".sent-message").classList.add("d-block");
					thisForm.reset();
				} else {
					throw new Error(data ? data : "Form submission failed and no error message returned from: " + action);
				}
			})
			.catch((error) => {
				displayError(thisForm, error);
			});
	}

	function displayError(thisForm, error) {
		thisForm.querySelector(".loading").classList.remove("d-block");
		thisForm.querySelector(".error-message").innerHTML = error;
		thisForm.querySelector(".error-message").classList.add("d-block");
	}
})();
