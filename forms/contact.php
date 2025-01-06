<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'msung98@naver.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;

  // -------------------- [변경 내용 1] -------------------------
  // 제목(Subject)을 단순히 $_POST['subject']로 할 수도 있지만
  // "[브랜드명] 문의"처럼 조합하기도 가능.
  // 예: $contact->subject = '[' . $_POST['brand'] . '] ' . $_POST['subject'];
  // 원하시는 형식으로 조정하면 됩니다.
  //-------------------------------------------------------------
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  // $contact->subject = $_POST['subject'];
  // (원본) 위를 주석처리하고, 브랜드명을 포함한 제목 예시:
  $contact->subject = '[' . ($_POST['brand'] ?? 'No Brand') . '] ' . ($_POST['subject'] ?? 'No Subject');


  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  // -------------------- [변경 내용 2] -------------------------
  // 폼 항목 추가: brand, phone, location, store, privacy
  // $contact->add_message( 값, '레이블', 우선순위(숫자) );
  // 우선순위가 큰 값(예: 10 이상)은 아래쪽에 표시됨.

  // 기존 메시지
  $contact->add_message( $_POST['name'],    '이름',         1);
  $contact->add_message( $_POST['email'],   '이메일',       2);
  // 추가된 폼 필드
  if(isset($_POST['brand'])) {
    $contact->add_message( $_POST['brand'],   '브랜드',        3);
  }
  if(isset($_POST['phone'])) {
    $contact->add_message( $_POST['phone'],   '전화번호',      4);
  }
  if(isset($_POST['location'])) {
    $contact->add_message( $_POST['location'],'창업희망지역',  5);
  }
  if(isset($_POST['store'])) {
    $contact->add_message( $_POST['store'],   '입점희망점포',  6);
  }
  // 개인정보 동의(agree/disagree)
  if(isset($_POST['privacy'])) {
    $privacy_label = ($_POST['privacy'] === 'agree') ? '동의합니다' : '동의하지 않습니다';
    $contact->add_message( $privacy_label,     '개인정보 동의',  7 );
  }

  // 기존 message(추가정보)
  $contact->add_message( $_POST['message'], '추가정보',     10);

  // -----------------------------------------------------------
  echo $contact->send();
?>