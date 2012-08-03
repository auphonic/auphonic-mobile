<?php

$api = 'https://auphonic.com/';
$call = $_SERVER['REQUEST_URI'];
$call = substr($call, strpos($call, '?') + 1);
$queryStringStart = strpos($call, '&');
if ($queryStringStart !== false) $call[$queryStringStart] = '?';

$url = $api . $call;
$method = $_SERVER['REQUEST_METHOD'];
$data = file_get_contents('php://input');
$headers = apache_request_headers();

// Simulate latency between 100-600 ms
srand();
usleep(rand(1, 6) * 100000);

$response = CURLRequest::create(array(
  'headers' => array(
    'Accept' => 'application/json',
    'Content-Type' => 'application/json',
    'Authorization' => $headers['Authorization']
  )
))->request($url, $method, $data);

$log = 'log.txt';
if (filesize($log) > 1024 * 512) unlink($log); // wipe if the log is big
file_put_contents($log, date('y-m-d H:i:s') . ' ' . strtoupper($method) . ' ' . $url . ($data ? ' - ' . $data : '') . "\n", FILE_APPEND);

if (!($response instanceof CURLResponse)) echo $response;
else echo $response->getContent();

class CURLRequest {

  protected $options = array(
    'cookies' => null,
    'headers' => array(),
    'referer' => null,
    'header' => true,
    'followlocation' => true,
    'returntransfer' => true
  );

  public function __construct($options = array()) {
    foreach ($options as $key => $value)
      $this->options[$key] = $value;
  }

  public static function create($options = array()) {
    return new CURLRequest($options);
  }

  public function request($url, $method = null, $data = null) {
    $method = in_array($method = strtolower($method), array('get', 'post', 'put', 'delete')) ? $method : 'get';
    $options = $this->options;

    if ($method == 'get') {
      if (!empty($data)) $url .= ((strrpos($url, '?') !== false) ? '&' : '?') . (is_array($data) ? http_build_query($data, '', '&') : $data);
      $options['httpget'] = true;
      unset($data);
    } elseif ($method == 'post') {
      $options['post'] = true;
    } else {
      $options['customrequest'] = strtoupper($method);
    }

    $headers = array();
    foreach ($options['headers'] as $key => $value)
      $headers[] = $key . ': ' . $value;

    if ($options['cookies']) $options['cookiefile'] = $options['cookiejar'] = $options['cookies'];
    $options['url'] = $url;
    $options['httpheader'] = $headers;
    unset($options['headers'], $options['cookies']);

    if (!empty($data)) $options['postfields'] = is_array($data) ? http_build_query($data, '', '&') : $data;

    return $this->fetch($options);
  }

  protected function fetch($options) {
    $request = curl_init();

    foreach ($options as $key => $value)
      curl_setopt($request, constant('CURLOPT_'.strtoupper($key)), $value);

    $response = curl_exec($request);
    if ($response) $response = new CURLResponse($response);
    else $response = curl_errno($request) . ' - ' . curl_error($request);

    curl_close($request);
    return $response;
  }

}

class CURLResponse {

  private $headers = array();
  private $content = null;

  public function __construct($response) {
    $this->parse($response);
  }

  public function parse($response) {
    $headers = array();

    preg_match_all('#HTTP/\d\.\d.*?$.*?\r\n\r\n#ims', $response, $m);
    $head = explode("\r\n", str_replace("\r\n\r\n", '', array_pop($m[0])));
    $version = array_shift($head);

    preg_match('#HTTP/(\d\.\d)\s(\d\d\d)\s(.*)#', $version, $m);
    if (!empty($m)) {
      $headers['Http-Version'] = $m[1];
      $headers['Status-Code'] = $m[2];
      $headers['Status'] = $m[2] . ' ' . $m[3];
    }

    foreach ($head as $header) {
      preg_match('#(.*?)\:\s(.*)#', $header, $m);
      $headers[$m[1]] = $m[2];
    }

    $this->headers = $headers;
    $this->content = preg_replace('#HTTP/\d\.\d.*?$.*?\r\n\r\n#ims', '', $response);
  }

  public function getHeaders() {
    return $this->headers;
  }

  public function getContent() {
    return $this->content;
  }

}
