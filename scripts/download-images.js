const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 小红书图片链接数组
const imageUrls = [
  'https://sns-webpic-qc.xhscdn.com/202508211122/cc60d77b3fac3684cbfebc3fdd14b13a/1040g00831l0i7i6m2u2g5p46nrojokig2eocqh0!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211122/b0a51fe55e55ff3235e18e4e9de28e65/1040g00831komht1diu3g5omobmhgga1o792g5cg!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211122/a135bd3ffc7c20edee6f5fc5b22e0fd9/1040g00831l0i7i6m2u0g5p46nrojokig12rghvo!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211122/c75cbf5b1556d6c114284d1d81cb0caa/1040g00831l0i7i6m2u105p46nrojokig0msike0!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211122/5f8f8888f72651a567992d8e25b1a20b/1040g00831l0i7i6m2u1g5p46nrojokigkbbk1oo!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/c000a34253ea68d6ebf120ec3e0ed2ea/1040g2sg319298qgekua05pf6h6519ed4oduii38!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/3a55a9907d529fb35941f0b1718acec1/1040g2sg31l778pck52e05n6ikt3lnt61uj4i19g!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/bdb6f791cc812b58d15493277c7733ef/1040g2sg319298qgeku705pf6h6519ed433unon0!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/d61c16a5c201dcb660fd78e71a7ec22c/1040g2sg319298qgeku7g5pf6h6519ed432qig7g!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/0178f9d425f22a4bd0361d80ec402856/1040g2sg319298qgeku805pf6h6519ed4fdh9r3o!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/43dfbc86f69d2b1648b99676d227279f/1040g2sg31cel7nnq0k5g5npnb07g9flasnrilno!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/d9ec4366ffb2f0d9e2984fb3650e904a/1040g00831cel7nsrgm6g5npnb07g9flat841nq8!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/1242d1bbff494ba353922739a484e705/1040g2sg31cel7nn5gudg5npnb07g9flar810g68!nd_dft_wlteh_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/96d8f89a20157ed51bdc767768a736a8/1040g2sg31cel7ntg0mdg5npnb07g9fla6f4ql5g!nd_dft_wgth_webp_3',
  'https://sns-webpic-qc.xhscdn.com/202508211123/38ba348ea6335ef238aa3c1755ad0d74/1040g00831cel7ntdgu6g5npnb07g9fla0i3vf30!nd_dft_wlteh_webp_3'
];

// 下载图片函数
function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const filePath = path.join(__dirname, '..', 'public', 'images', 'xiaohongshu', filename);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    };

    protocol.get(options, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ 下载成功: ${filename}`);
          resolve(filename);
        });
        
        fileStream.on('error', (err) => {
          fs.unlinkSync(filePath);
          console.log(`❌ 下载失败: ${filename} - ${err.message}`);
          reject(err);
        });
      } else {
        console.log(`❌ HTTP错误: ${filename} - 状态码: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ 网络错误: ${filename} - ${err.message}`);
      reject(err);
    });
  });
}

// 主函数
async function downloadAllImages() {
  console.log('🚀 开始下载小红书图片...\n');
  
  for (let i = 0; i < imageUrls.length; i++) {
    const filename = `xiaohongshu-${String(i + 1).padStart(2, '0')}.webp`;
    
    try {
      await downloadImage(imageUrls[i], filename);
      // 添加延时避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`⚠️  跳过图片 ${filename}: ${error.message}`);
    }
  }
  
  console.log('\n🎉 图片下载任务完成！');
}

// 执行下载
downloadAllImages().catch(console.error);