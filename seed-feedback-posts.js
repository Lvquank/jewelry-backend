/**
 * Seed 3 bài Feedback vào MongoDB Atlas (PostModel)
 * Usage: node seed-feedback-posts.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// ─── PostModel (inline để script chạy độc lập) ───────────────────────────────
const postSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    slug:    { type: String, unique: true },
    image:   { type: String, required: true },
    images:  [{ type: String }],
    summary: { type: String },
    content: { type: String, required: true },
    type:    { type: String, required: true, enum: ['Tin Tức', 'Kiểm Định', 'Hướng Dẫn', 'Feedback'] },
    author:  { type: String, default: 'Jensy Admin' },
  },
  { timestamps: true }
);

postSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

// ─── Dữ liệu 3 bài Feedback ──────────────────────────────────────────────────
// Ảnh lấy từ cloudinary-feedback-posts.json đã upload

const FEEDBACK_POSTS = [
  {
    // feedback1 — Tiktoker Vân Anh Vũ
    title: 'Feedback Của Tiktoker Vân Anh Vũ – Gần 300K Followers',
    slug:  'feedback-cua-tiktoker-van-anh-vu-gan-300k-followers',
    image: 'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535602/jensy/feedback/feedback-cua-tiktoker-van-anh-vu-gan-300k-followers/1.png',
    images: [
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535602/jensy/feedback/feedback-cua-tiktoker-van-anh-vu-gan-300k-followers/1.png',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535604/jensy/feedback/feedback-cua-tiktoker-van-anh-vu-gan-300k-followers/2.png',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535605/jensy/feedback/feedback-cua-tiktoker-van-anh-vu-gan-300k-followers/3.png',
    ],
    summary: 'Jensy rất vui khi nhận được những phản hồi tích cực từ tiktoker Vân Anh Vũ – một creator với gần 300K người theo dõi!',
    content: `Ngàn lời quảng cáo cũng không có giá trị nếu sản phẩm không chất lượng và không nhận được sự đánh giá cao của khách hàng sau khi mua và sử dụng sản phẩm. Jensy luôn tạo sự tin tưởng đến khách hàng, để có được lòng tin đó chúng tôi đã nỗ lực cho ra nhiều sản phẩm đẹp và có chất lượng.

Jensy rất vui khi nhận được những phản hồi tích cực từ tiktoker Vân Anh Vũ – một creator với gần 300K người theo dõi! 🎉

🌟 Vân Anh chia sẻ:
"Thực sự ngoài mong đợi! Sản phẩm của Jensy không chỉ đẹp, chất lượng mà còn cực kỳ tiện lợi. Mình đã thử và hoàn toàn hài lòng! Nhất định sẽ giới thiệu cho mọi người!"

Không chỉ riêng Vân Anh, hàng ngàn khách hàng cũng đã trải nghiệm và dành những lời khen có cánh cho sản phẩm nhà Jensy. Đây chính là động lực để Jensy không ngừng nâng cấp và mang đến những sản phẩm/dịch vụ tốt nhất! 🚀`,
    type:   'Feedback',
    author: 'Uyên',
  },
  {
    // feedback2 — Những Feedback Khách Hàng 2024
    title: 'Những Feedback Khách Hàng Của JENSY 2024',
    slug:  'nhung-feedback-khach-hang-cua-jensy-2024',
    image: 'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535606/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/1.png',
    images: [
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535606/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/1.png',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535614/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/2_z5513523130057_6fec76591e2643e94970b149beec4137_ecbd5ab78af84474a8c3803ac9cef56b_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535615/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/3_z5513523179525_efb2ed6621880dca39fda0ee8674c561_675b6cf2446f4ec4acbf9fa76e65f2c7_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535617/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/4_z5513523142616_feddcb737851d09d951fdeb87e8444ce_e1cabab5032541ceab2a2b8835180848_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535618/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/5_z5513523174833_24cbc92d80c034eaafc9da3d149861de_6a0b39625f9949f19105fb4bdc9c881d_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535619/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/6_z5513523136335_8f4f62044e692aa668e02a18dd07873b_3175c034af454935b30f12b8c271b7e9_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535620/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/7_z5513523151209_4efbf0132cfb654cce383e970ecb080a_94892403632345dc864f57820d22f9db_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535621/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/8_z5513523164181_eafa9bb4b4840e29050521e6743042be_cb08f7f5534c4a9faca6ac7ab92ce1d1_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535622/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/9_z5513523168847_aaa721196978fcdb109e2c6b29426107_b6b069c38ca140d69bb39befa03225e0_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535607/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/10_z5513562443525_b3d5df7569417d31952202847a14dc99_54d92f3967234072b77147ac7bcaef7c_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535608/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/11_z5513562477875_364f722bcfe8449689a68a1b27e4569f_54b606be657d414cad8df2f5fec6b393_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535609/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/12_z5513562453947_99eade778aa227c195dfb95f62c432e0_22ffc7a92092452eb3c11f093f5fc572_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535609/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/13_z5513562459024_abf37fd1d1faa56a49ed9d66207f04d9_58664816ce8b43b1b5764be44f8843ef_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535610/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/14_z5513562458410_a53d8f77a0c264dc31aaf7442b3433bd_62919bd01f4a447c83a65940c0b30bd4_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535611/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/15_z5513562470464_d0fd5bb9609a319867ab20c6b1f01d76_1413a3d0c36944f18c1cfc1ccc3f4865_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535612/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/16_z5513562476977_0c049577fa5a04b8ef5906198336e23a_e2f9713617fd43b3ae1515fa18915db1_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535613/jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/17_z5513562481198_11a779a9615e79a25d2ec4a5c6c30fe8_8370c298db0e46b5ae331f8430a48a3b_grande.jpg',
    ],
    summary: 'Từ đầu năm 2024 tới nay, Jensy đã nhận được rất nhiều sự ủng hộ và những phản hồi tích cực từ khách hàng.',
    content: `Từ đầu năm 2024 tới nay, sau Hành trình Lột xác từ 20Silvers sang Jensy, Jen đã nhận được rất nhiều sự ủng hộ của khách hàng. Những sự ủng hộ ấy đã là niềm vui, có được những phản hồi và đánh giá của khách lại là một niềm hạnh phúc vô cùng đối với Jensy. Những nhận xét dù tốt dù xấu cũng giúp cho Jensy ngày càng phát triển vững mạnh hơn và chất lượng ngày càng tốt hơn nữa.

Jensy xin chân thành cảm ơn sự tin dùng và ủng hộ cũng như những phản hồi của quý khách hàng. Bằng uy tín và sự chân thành, Jensy vẫn luôn và sẽ cố gắng hơn nữa để mang những gì tốt nhất đến với mọi người.

Cảm ơn các bạn rất nhiều trong thời gian qua vì đã ủng hộ cho shop. Những bức ảnh feedback của các bạn chính là món quà tinh thần cũng như là động lực lớn nhất để Jensy cố gắng trong những bước đi sắp tới.`,
    type:   'Feedback',
    author: 'Kho + Đóng Đơn',
  },
  {
    // feedback3 — Những Feedback Có Tâm (2021)
    title: 'Những Feedback Có Tâm Từ Khách Hàng Của JENSY Thân Yêu',
    slug:  'nhung-feedback-co-tam-tu-khach-hang-cua-jensy-than-yeu',
    image: 'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535597/jensy/feedback/abc/1.png',
    images: [
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535597/jensy/feedback/abc/1.png',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535598/jensy/feedback/abc/2_1_d01dd7ec651b4b1983506297076b820e_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535599/jensy/feedback/abc/3_untitled-2_1d93b2bb8680439b9cbfd4f18f426624_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535600/jensy/feedback/abc/4_3_5d8bbb01cc7041249240d48efd16ee3e_grande.jpg',
      'https://res.cloudinary.com/drxum5uxt/image/upload/v1776535601/jensy/feedback/abc/5_oo_b333e516adc0431bbd1290bafe5bd761_grande.jpg',
    ],
    summary: 'Ra đời từ đầu năm 2017, Jensy luôn cố gắng cung cấp trang sức bạc đẹp, chất lượng cao với giá cạnh tranh.',
    content: `Ra đời từ đầu năm 2017 đến nay Jensy vẫn luôn cố gắng để cung cấp cho những vị khách hàng dễ thương của mình những sản phẩm TRANG SỨC BẠC đẹp thời thượng, chất lượng cao với giá cạnh tranh.

Cảm ơn các bạn rất nhiều trong thời gian qua vì đã ủng hộ cho shop. Những bức ảnh feedback của các bạn chính là món quà tinh thần cũng như là động lực lớn nhất để Jensy cố gắng trong những bước đi sắp tới.

Với tiêu chí chất lượng và dịch vụ được đặt lên hàng đầu, Jensy luôn tự tin sẽ làm hài lòng tất cả các khách hàng. Mong mọi người hãy luôn ủng hộ và đừng quên gửi những ảnh feedback hoặc nhận xét về cho shop nhé.`,
    type:   'Feedback',
    author: 'THÔNG',
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('===========================================');
  console.log('   Seed Feedback Posts => MongoDB Atlas');
  console.log('===========================================\n');

  await mongoose.connect(process.env.MongoDB);
  console.log('✅ Kết nối MongoDB thành công\n');

  let inserted = 0;
  let skipped  = 0;

  for (const data of FEEDBACK_POSTS) {
    const exists = await Post.findOne({ slug: data.slug });
    if (exists) {
      console.log(`⏩ Bỏ qua (đã tồn tại): "${data.title}"`);
      skipped++;
      continue;
    }
    const post = new Post(data);
    await post.save();
    console.log(`✅ Đã thêm: "${data.title}"`);
    console.log(`   🖼  Ảnh đại diện : ${data.image}`);
    console.log(`   📸 Số ảnh phụ   : ${data.images.length}`);
    inserted++;
  }

  console.log('\n===========================================');
  console.log('              KẾT QUẢ');
  console.log('===========================================');
  console.log(`✅ Đã thêm : ${inserted} bài`);
  console.log(`⏩ Bỏ qua  : ${skipped} bài (đã tồn tại)`);

  await mongoose.disconnect();
  console.log('\n🔌 Đã ngắt kết nối MongoDB.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
