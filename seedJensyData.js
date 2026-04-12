const mongoose = require("mongoose");
const dotenv = require('dotenv');
const Product = require('./src/models/ProductModel');
const Post = require('./src/models/PostModel');

dotenv.config();

const products = [
    {
        name: 'Bông Tai Bạc Gắn Kim Cương Moissanite Xi Bạch Kim, Kiểm Định GRA "Bowtie" BTJ5',
        image: 'https://jensy.vn/products/bong-tai-bac-nu-s925-cao-cap-jensy-hinh-no-dinh-kim-cuong-moissanite-bowtie-btj5',
        type: 'Bông Tai Bạc',
        category: 'Bông Tai Bạc/ Khuyên Tai Bạc',
        material: 'Bạc Xi Bạch Kim, Moissanite',
        price: 658000,
        countInStock: 50,
        rating: 5,
        description: 'Khuyên Tai Bạc Nữ Sang Trọng. Kiểm định GRA.',
        discount: 0
    },
    {
        name: 'Dây Chuyền Kim Cương Moissanite 5 Ly JENSY Xi Bạch Kim, Kiểm Định GRA "Julia" VCJ1',
        image: 'https://jensy.vn/products/vong-co-bac-s925-dinh-da-moissanite-vcj1-day-chuyen-bac-nu-sang-trong',
        type: 'Dây Chuyền Bạc',
        category: 'Dây Chuyền Bạc',
        material: 'Bạc Xi Bạch Kim, Moissanite',
        price: 978000,
        countInStock: 25,
        rating: 5,
        description: 'Vòng Cổ Bạc Nữ Sang Trọng. Kiểm định GRA.',
        discount: 5
    },
    {
        name: 'Nhẫn Bạc Gắn Kim Cương Moissanite Xi Bạch Kim, Kiểm Định GRA "Aliyah" NLJ2',
        image: 'https://jensy.vn/products/nhan-bac-nu-s925-gan-da-moissanite-2-tu-tieng-anh-nlj2',
        type: 'Nhẫn Bạc',
        category: 'Nhẫn Đơn Bạc',
        material: 'Bạc Xi Bạch Kim, Moissanite',
        price: 728000,
        countInStock: 100,
        rating: 4.5,
        description: 'Nhẫn Bạc Nữ Đính Kim Cương Sang Trọng.',
        discount: 0
    },
    {
        name: 'Lắc Tay Bạc Gắn Kim Cương Moissanite 7 Ly Xi Bạch Kim "Frosted Aura" LTJ4',
        image: 'https://jensy.vn/products/lac-tay-bac-gan-kim-cuong-moissanite-7-ly',
        type: 'Lắc Tay Bạc',
        category: 'Lắc Tay Bạc',
        material: 'Bạc Xi Bạch Kim, Moissanite',
        price: 1118000,
        countInStock: 30,
        rating: 4.8,
        description: 'Vòng Tay Bạc Nữ Sang Trọng.',
        discount: 0
    },
    {
        name: 'Dây Chuyền Đôi Bạc S925 JENSY "Couple Ring" VCDJ1',
        image: 'https://jensy.vn/products/vong-co-doi-bac-couple-ring-vcdj1',
        type: 'Dây Chuyền Đôi',
        category: 'Cặp Đôi',
        material: 'Bạc S925',
        price: 908000,
        countInStock: 15,
        rating: 5,
        description: 'Vòng Cổ Đôi Bạc Nam Nữ Tình Yêu',
        discount: 10
    }
];

// ===================== KIỂM ĐỊNH (2 bài) =====================
const kiemDinhPosts = [
    {
        title: 'Giấy Kiểm Định Kim Cương Moissanite Chuẩn GRA',
        slug: 'giay-kiem-dinh-kim-cuong-moissanite-gra-chuan',
        image: '/images/articles/kiem-dinh/kiem-dinh-gra.png',
        summary: 'Tất cả các sản phẩm gắn Kim cương Moissanite của Jensy đều đi kèm Giấy Kiểm Định GRA Uy tín cùng với thẻ Bảo Hành.',
        content: `Tất cả các sản phẩm gắn Kim cương Moissanite của Jensy đều đi kèm Giấy Kiểm Định GRA Uy tín cùng với thẻ Bảo Hành.

Với mỗi đơn hàng, khách hàng sẽ nhận được:
- 1 Giấy Kiểm Định GRA chính hãng
- 1 Thẻ Bảo Hành Jensy
- Hộp đựng trang sức cao cấp

GRA (Gemological Research Association) là tổ chức kiểm định kim cương Moissanite uy tín hàng đầu thế giới. Mỗi viên kim cương Moissanite đều được kiểm tra kỹ lưỡng về:
- Độ trong suốt (Clarity)
- Màu sắc (Color) 
- Kích thước chính xác (Carat)
- Chất lượng giác cắt (Cut)

Giấy kiểm định GRA cam kết viên đá trên sản phẩm là Kim Cương Moissanite thật, đạt tiêu chuẩn quốc tế.`,
        type: 'Kiểm Định',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Giấy Kiểm Định Bạc Chuẩn GIV',
        slug: 'bac-jensy-khong-lo-hoen-gi',
        image: '/images/articles/kiem-dinh/kiem-dinh-giv.png',
        summary: 'Bạc JENSY - Không Lo Hoen Gỉ. Tất cả sản phẩm Bạc của Jensy đều có giấy kiểm định đầu vào GIV.',
        content: `Bạc JENSY - Không Lo Hoen Gỉ

Tất cả sản phẩm Bạc của Jensy đều có giấy kiểm định đầu vào GIV.

GIV là tên viết tắt của Viện Đá Quý Việt Nam (Gemological Institute of Vietnam) - đơn vị kiểm định uy tín tại Việt Nam.

Cam kết chất lượng Bạc Jensy:
- Bạc nguyên chất S925 (92.5% bạc ròng)
- Xi lớp Bạch Kim (Rhodium) chống hoen gỉ
- Không gây dị ứng da
- Giấy kiểm định GIV kèm theo mỗi sản phẩm

Quy trình kiểm định:
1. Lấy mẫu bạc từ lô hàng
2. Kiểm tra hàm lượng bạc bằng thiết bị chuyên dụng
3. Cấp giấy chứng nhận với mã kiểm định duy nhất
4. Đóng dấu GIV trên giấy kiểm định

Khách hàng hoàn toàn yên tâm khi mua trang sức bạc tại Jensy!`,
        type: 'Kiểm Định',
        author: 'PHẠM HẠ TUYÊN'
    }
];

// ===================== FEEDBACK (3 bài) =====================
const feedbackPosts = [
    {
        title: 'Feedback Của Tiktoker Vân Anh Vũ – Gần 300K Followers',
        slug: 'feedback-cua-tiktoker-van-anh-vu-gan-300k-followers',
        image: '/images/articles/feedback/feedback-tiktoker.png',
        summary: 'Ngàn lời quảng cáo cũng không có giá trị nếu sản phẩm không chất lượng và không nhận được sự đánh giá cao của khách hàng.',
        content: `Ngàn lời quảng cáo cũng không có giá trị nếu sản phẩm không chất lượng và không nhận được sự đánh giá cao của khách hàng.

Tiktoker Vân Anh Vũ - một trong những influencer nổi tiếng với gần 300K followers trên TikTok đã tin tưởng lựa chọn trang sức Jensy.

Vân Anh chia sẻ: "Mình rất ấn tượng với chất lượng bạc của Jensy. Đeo cả ngày mà không bị đen, không gây dị ứng. Thiết kế rất tinh tế và sang trọng, phù hợp với nhiều outfit khác nhau."

Sản phẩm Vân Anh yêu thích:
- Dây chuyền Kim Cương Moissanite "Julia" VCJ1
- Bông tai "Bowtie" BTJ5  
- Nhẫn bạc "Aliyah" NLJ2

Cảm ơn Vân Anh đã tin tưởng và đồng hành cùng Jensy! 💙`,
        type: 'Feedback',
        author: 'Uyên'
    },
    {
        title: 'Những Feedback Khách Hàng Của JENSY 2024',
        slug: 'nhung-feedback-khach-hang-cua-jensy-2024',
        image: '/images/articles/feedback/feedback-2024.png',
        summary: 'Từ đầu năm 2024 tới nay, sau Hành trình Lột xác từ 20Silvers sang Jensy, Jen đã nhận được rất nhiều sự ủng hộ của khách hàng.',
        content: `Từ đầu năm 2024 tới nay, sau Hành trình Lột xác từ 20Silvers sang Jensy, Jen đã nhận được rất nhiều sự ủng hộ của khách hàng.

Một số feedback tiêu biểu:

⭐⭐⭐⭐⭐ "Bạc đẹp lắm, đóng gói cẩn thận, giao hàng nhanh. Sẽ ủng hộ shop dài dài!" - Chị Hương, Hà Nội

⭐⭐⭐⭐⭐ "Mua tặng bạn gái, bạn ấy thích lắm. Bạc sáng đẹp, có kiểm định hẳn hoi." - Anh Minh, TP.HCM

⭐⭐⭐⭐⭐ "Đeo 3 tháng rồi mà bạc vẫn sáng bóng, không hề bị đen. Chất lượng thật sự tốt!" - Chị Linh, Đà Nẵng

⭐⭐⭐⭐⭐ "Thiết kế xinh xắn, giá cả hợp lý, lại có giấy kiểm định. Rất hài lòng!" - Chị Trang, Hải Phòng

Jensy luôn nỗ lực để mang đến sản phẩm chất lượng nhất cho khách hàng! 💙`,
        type: 'Feedback',
        author: 'Kho + Đóng Đơn'
    },
    {
        title: 'Những Feedback Có Tâm Từ Khách Hàng Của JENSY Thân Yêu',
        slug: 'nhung-feedback-co-tam-tu-khach-hang-cua-jensy',
        image: '/images/articles/feedback/feedback-heartfelt.png',
        summary: 'Ra đời từ đầu năm 2017 đến nay Jensy vẫn luôn cố gắng để cung cấp cho những vị khách hàng dễ thương của mình những sản phẩm tốt nhất.',
        content: `Ra đời từ đầu năm 2017 đến nay Jensy vẫn luôn cố gắng để cung cấp cho những vị khách hàng dễ thương của mình những sản phẩm tốt nhất.

Sau nhiều năm hoạt động, Jensy đã phục vụ hơn 50.000+ khách hàng trên toàn quốc. Dưới đây là những feedback chân thật nhất:

💬 "Mua ở Jensy 5 lần rồi, lần nào cũng hài lòng. Shop tư vấn nhiệt tình, bạc đẹp lắm!" 

💬 "Mình là khách hàng từ thời 20Silvers, giờ sang Jensy vẫn giữ nguyên chất lượng, thậm chí còn đẹp hơn!"

💬 "Tặng mẹ dây chuyền mua ở Jensy, mẹ đeo suốt. Cảm ơn Jen nhiều!"

💬 "Lần đầu mua online mà hài lòng đến vậy. Đóng gói đẹp, có thiệp, có giấy kiểm định đầy đủ."

Mỗi feedback là động lực để Jensy tiếp tục cố gắng! Cảm ơn các bạn rất nhiều! 💙`,
        type: 'Feedback',
        author: 'THÔNG'
    }
];

// ===================== HƯỚNG DẪN (9 bài) =====================
const huongDanPosts = [
    {
        title: 'Hướng Dẫn Đo Size Lắc Tay',
        slug: 'huong-dan-do-size-lac-tay',
        image: '/images/articles/huong-dan/huong-dan-size-lac-tay.png',
        summary: 'Nếu bạn đang tìm kiếm một chiếc lắc tay bạc từ Jensy nhưng không chắc chắn về size phù hợp, hãy xem hướng dẫn đo size này.',
        content: `Nếu bạn đang tìm kiếm một chiếc lắc tay bạc từ Jensy nhưng không chắc chắn về size phù hợp, hoặc bạn mua lắc tay tặng người thân nhưng không biết size, hãy làm theo hướng dẫn sau:

CÁCH 1: Đo bằng thước dây
1. Quấn thước dây quanh cổ tay
2. Đọc số cm tại điểm giao nhau
3. Cộng thêm 1-2cm để lắc tay vừa vặn thoải mái

CÁCH 2: Đo bằng sợi dây
1. Dùng sợi dây hoặc giấy quấn quanh cổ tay
2. Đánh dấu điểm giao nhau
3. Đo chiều dài sợi dây bằng thước thẳng

Bảng size lắc tay tham khảo:
- Size S: 14-15cm (tay nhỏ)
- Size M: 15.5-16.5cm (tay trung bình)
- Size L: 17-18cm (tay lớn)
- Size XL: 18.5-20cm (tay rất lớn)

Lưu ý: Nếu bạn thích đeo rộng, hãy chọn size lớn hơn 1 bậc.`,
        type: 'Hướng Dẫn',
        author: 'TRƯƠNG THỊ TUYẾT KHOA'
    },
    {
        title: 'Hướng Dẫn Đo Size Dây Chuyền',
        slug: 'huong-dan-do-size-day-chuyen',
        image: '/images/articles/huong-dan/huong-dan-size-day-chuyen.png',
        summary: 'Bạn đam mê trang sức và muốn sở hữu một chiếc dây chuyền bạc đẹp từ Jensy? Hãy xem hướng dẫn chọn size phù hợp.',
        content: `Bạn đam mê trang sức và muốn sở hữu một chiếc dây chuyền bạc đẹp từ Jensy? Hoặc bạn muốn mua dây chuyền bạc để tặng người thân? Hãy tham khảo hướng dẫn chọn size dưới đây:

BẢNG SIZE DÂY CHUYỀN:
- 35cm (14"): Vòng cổ ngắn, ôm sát cổ (Choker)
- 40cm (16"): Nằm trên xương quai xanh
- 45cm (18"): Phổ biến nhất, nằm dưới xương quai xanh
- 50cm (20"): Nằm trên ngực
- 55cm (22"): Nằm giữa ngực

CÁCH ĐO:
1. Dùng sợi dây đặt quanh cổ
2. Điều chỉnh chiều dài theo ý muốn
3. Đo chiều dài sợi dây

MẸO CHỌN SIZE:
- Mặt dây chuyền nhỏ: chọn 40-45cm
- Mặt dây chuyền lớn: chọn 45-50cm
- Đeo casual hàng ngày: 45cm là chuẩn nhất`,
        type: 'Hướng Dẫn',
        author: 'TRƯƠNG THỊ TUYẾT KHOA'
    },
    {
        title: 'Hướng Dẫn Thanh Toán',
        slug: 'huong-dan-thanh-toan',
        image: '/images/articles/huong-dan/huong-dan-thanh-toan.png',
        summary: 'Hướng dẫn chi tiết các phương thức thanh toán tại Jensy: chuyển khoản, ví MoMo, thanh toán khi nhận hàng.',
        content: `1. THANH TOÁN TRẢ TRƯỚC

Thanh toán Chuyển khoản qua Ngân hàng và Thanh toán qua ví điện tử (MOMO)

Thanh toán qua ví điện tử: Quý khách chọn phương thức thanh toán qua MoMo, quét mã QR hoặc chuyển khoản theo thông tin hiển thị.

Thanh toán chuyển khoản ngân hàng:
- Ngân hàng: Vietcombank
- Chủ tài khoản: THÁI BÌNH DƯƠNG
- Nội dung CK: [Tên] + [SĐT]

2. THANH TOÁN KHI NHẬN HÀNG (COD)

Quý khách thanh toán trực tiếp cho nhân viên giao hàng khi nhận được sản phẩm.

Lưu ý:
- Kiểm tra kỹ sản phẩm trước khi thanh toán
- Được mở hộp kiểm tra trước mặt shipper
- Miễn phí ship với đơn hàng từ 500K`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Đặt Viết Thiệp Theo Yêu Cầu',
        slug: 'huong-dan-dat-viet-thiep-theo-yeu-cau',
        image: '/images/articles/huong-dan/huong-dan-thiep.png',
        summary: 'Viết thiệp theo yêu cầu - Tạo điểm nhấn đặc biệt cho quà tặng của bạn.',
        content: `Viết thiệp theo yêu cầu - Tạo điểm nhấn đặc biệt cho quà tặng của bạn

Bạn muốn mua trang sức nhà Jen để tặng quà cho người đặc biệt? Jensy cung cấp dịch vụ viết thiệp miễn phí theo yêu cầu!

CÁCH ĐẶT VIẾT THIỆP:
1. Chọn sản phẩm và thêm vào giỏ hàng
2. Tại phần ghi chú đơn hàng, ghi: "YÊU CẦU VIẾT THIỆP"
3. Kèm nội dung thiệp bạn muốn viết
4. Jensy sẽ viết thiệp bằng tay với nét chữ đẹp

VÍ DỤ NỘI DUNG THIỆP:
- "Happy Birthday! Chúc em luôn xinh đẹp 💙"
- "Tặng mẹ yêu nhân ngày 20/10 ❤️"
- "Happy Anniversary! Love you 3000 💕"

LƯU Ý:
- Nội dung thiệp tối đa 50 từ
- Thiệp được viết tay trên giấy cao cấp
- Hoàn toàn MIỄN PHÍ`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Đặt Khắc Theo Yêu Cầu',
        slug: 'huong-dan-dat-khac-theo-yeu-cau',
        image: '/images/articles/huong-dan/huong-dan-khac-ten.png',
        summary: 'Hướng dẫn chi tiết cách đặt dịch vụ khắc tên, khắc chữ lên trang sức bạc tại Jensy.',
        content: `Bước 1: Lựa chọn Sản phẩm bạn muốn khắc

1. Trước hết, bạn cần lựa chọn sản phẩm mà bạn muốn khắc chữ lên. Chọn sản phẩm có biểu tượng "KHẮC TÊN" hoặc trong danh mục Khắc Tên.

Bước 2: Cung cấp thông tin khắc

Tại phần ghi chú đơn hàng, ghi rõ:
- Nội dung khắc (tên, ngày tháng, câu nói...)
- Font chữ mong muốn (nếu có)
- Vị trí khắc (mặt trong/ngoài)

Bước 3: Xác nhận thiết kế

Jensy sẽ gửi bản preview qua Zalo/Messenger để bạn xác nhận trước khi khắc.

LƯU Ý:
- Nội dung khắc tối đa 15 ký tự (bao gồm cả khoảng trắng)
- Hỗ trợ khắc tiếng Việt và tiếng Anh
- Thời gian hoàn thành: 1-2 ngày làm việc
- Phí khắc: Từ 30.000đ - 50.000đ tùy sản phẩm`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Làm Sáng Bạc Tại Nhà',
        slug: 'huong-dan-lam-sang-bac-tai-nha',
        image: '/images/articles/huong-dan/huong-dan-lam-sang-bac.png',
        summary: 'Có rất nhiều cách làm sáng Bạc, nhưng Jen sẽ chỉ cho bạn cách dễ và hiệu quả nhất.',
        content: `Có rất nhiều cách làm sáng Bạc, nhưng Jen sẽ chỉ cho bạn cách dễ và hiệu quả nhất:

1. Sử dụng chanh + muối hạt to
- Vắt nửa quả chanh vào bát nhỏ
- Thêm 1 thìa muối hạt to
- Ngâm trang sức bạc trong 5-10 phút
- Dùng bàn chải mềm chà nhẹ
- Rửa sạch với nước và lau khô

2. Sử dụng kem đánh răng
- Bôi kem đánh răng (loại trắng, không gel) lên bạc
- Dùng bàn chải mềm chà đều
- Rửa sạch và lau khô bằng khăn mềm

3. Sử dụng nước rửa bạc chuyên dụng (khuyên dùng)
- Nhúng trang sức vào dung dịch rửa bạc 5-10 giây
- Lấy ra rửa sạch với nước
- Lau khô bằng khăn mềm

LƯU Ý: Sản phẩm có gắn đá KHÔNG nên ngâm lâu trong dung dịch.`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Đặt Nhiều Sản Phẩm Trong Cùng 1 Đơn Hàng',
        slug: 'huong-dan-dat-nhieu-san-pham-trong-cung-1-don-hang',
        image: '/images/articles/huong-dan/huong-dan-nhieu-sp.png',
        summary: 'Hướng dẫn các bước đặt nhiều sản phẩm trong cùng một đơn hàng để tiết kiệm phí ship.',
        content: `CÁC BƯỚC ĐẶT NHIỀU SẢN PHẨM

Bước 1: Chọn sản phẩm Quý Khách hàng mong muốn sau đó Thêm vào giỏ và tiếp tục mua sắm.

Bước 2: Lướt tiếp trang web, chọn thêm sản phẩm khác rồi bấm "Thêm vào giỏ hàng".

Bước 3: Khi đã chọn đủ sản phẩm, bấm vào biểu tượng giỏ hàng ở góc phải trên cùng.

Bước 4: Kiểm tra lại giỏ hàng:
- Số lượng từng sản phẩm
- Tổng tiền
- Điều chỉnh số lượng nếu cần

Bước 5: Bấm "Thanh toán" và điền thông tin giao hàng.

MẸO:
- Đơn hàng từ 500K được MIỄN PHÍ SHIP
- Mua nhiều sản phẩm trong 1 đơn sẽ tiết kiệm phí vận chuyển
- Có thể áp dụng mã giảm giá tại bước thanh toán`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Sử Dụng Và Bảo Quản Bạc',
        slug: 'huong-dan-su-dung-va-bao-quan-bac',
        image: '/images/articles/huong-dan/huong-dan-bao-quan-bac.png',
        summary: 'Để trang sức bạc luôn sáng đẹp, các bạn cần lưu ý một số điều quan trọng trong việc sử dụng và bảo quản.',
        content: `Để trang sức bạc luôn sáng đẹp, các bạn lưu ý:

❌ KHÔNG NÊN:
- Tránh tiếp xúc trực tiếp với hóa chất, mỹ phẩm, dược phẩm, nước hoa
- Không nên đeo khi tắm, bơi, tập thể dục
- Không để bạc tiếp xúc với nước biển, nước nóng
- Tránh va chạm mạnh gây trầy xước

✅ NÊN:
- Tháo trang sức trước khi tắm, rửa bát, dọn dẹp
- Lau bạc bằng khăn mềm sau mỗi lần đeo
- Bảo quản trong hộp kín hoặc túi zip khi không sử dụng
- Để riêng từng món trang sức, tránh chồng lên nhau

💡 MẸO BẢO QUẢN:
- Bỏ 1 viên phấn trắng vào hộp đựng bạc để hút ẩm
- Sử dụng túi silica gel chống ẩm
- Đeo bạc thường xuyên giúp bạc luôn sáng (mồ hôi ít giúp bạc sáng)`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Hướng Dẫn Sử Dụng Và Chỉnh Sửa Nhẫn Freesize',
        slug: 'huong-dan-su-dung-va-chinh-sua-nhan-freesize',
        image: '/images/articles/huong-dan/huong-dan-freesize.png',
        summary: 'Bạn đừng quá lo lắng vì tay mình quá to hay quá nhỏ không có size nhẫn phù hợp.',
        content: `Bạn đừng quá lo lắng vì tay mình quá to hay quá nhỏ không có size nhẫn? Bạn không cần thắc mắc tay mình kích cỡ bao nhiêu nữa vì nhẫn Freesize sẽ giải quyết tất cả!

NHẪN FREESIZE LÀ GÌ?
Nhẫn freesize là loại nhẫn có thiết kế mở (open ring), cho phép điều chỉnh kích thước phù hợp với nhiều ngón tay khác nhau.

CÁCH CHỈNH SIZE NHẪN FREESIZE:
1. Đặt nhẫn lên ngón tay
2. Dùng 2 tay nhẹ nhàng bóp/mở nhẫn theo kích thước mong muốn
3. Thử đeo và điều chỉnh cho vừa vặn

LƯU Ý QUAN TRỌNG:
- Chỉ điều chỉnh TỪ TỪ, NHẸ NHÀNG
- KHÔNG bẻ mạnh vì có thể gãy nhẫn
- Không chỉnh quá nhiều lần (bạc có thể bị yếu)
- Nếu cần chỉnh nhiều, nên mang đến tiệm bạc

Nhẫn freesize phù hợp với size từ 12-18 (tương đương 52mm-58mm).`,
        type: 'Hướng Dẫn',
        author: 'PHẠM HẠ TUYÊN'
    }
];

// ===================== TIN TỨC (10 bài) =====================
const tinTucPosts = [
    {
        title: '✨ CHÚC MỪNG NĂM MỚI 2026 – JENSY ✨',
        slug: 'chuc-mung-nam-moi-2026-jensy',
        image: '/images/articles/news/news-newyear-2026.png',
        summary: 'Cảm ơn bạn đã luôn đồng hành cùng Jensy trong suốt năm qua. Bước sang năm mới, chúc bạn An Khang – Hạnh Phúc.',
        content: `Cảm ơn bạn đã luôn đồng hành cùng Jensy trong suốt năm qua 💙

Bước sang năm mới, chúc bạn An Khang – Hạnh Phúc – Luôn Tỏa Sáng!

🎊 Nhân dịp năm mới 2026, Jensy gửi tặng bạn:
- Giảm 10% toàn bộ sản phẩm
- Miễn phí ship đơn từ 300K
- Tặng thiệp chúc mừng năm mới

Chương trình áp dụng từ 01/01 - 15/01/2026.

Jensy - Lấp Lánh Em Xinh ✨`,
        type: 'Tin Tức',
        author: 'Tâm'
    },
    {
        title: 'Happy Valentine !',
        slug: 'happy-valentine',
        image: '/images/articles/news/news-valentine.png',
        summary: 'Tình yêu luôn được tạo nên từ những điều tinh tế và chân thành. Là những khoảnh khắc nhỏ nhưng đủ làm trái tim rung động.',
        content: `Tình yêu luôn được tạo nên từ những điều tinh tế và chân thành ✨

Là những khoảnh khắc nhỏ nhưng đủ làm trái tim rung động.

💝 VALENTINE COLLECTION - Bộ sưu tập dành riêng cho những cặp đôi:
- Nhẫn đôi bạc "Forever" 
- Dây chuyền đôi "Couple Ring"
- Lắc tay đôi "Infinity Love"

🎁 ƯU ĐÃI VALENTINE:
- Giảm 15% sản phẩm Cặp Đôi
- Tặng kèm thiệp viết tay + hộp quà cao cấp
- Miễn phí gói quà tặng

Đặt hàng sớm để nhận quà đúng ngày 14/2 nhé! 💕`,
        type: 'Tin Tức',
        author: 'Tâm'
    },
    {
        title: 'Món quà bạn tặng nói lên điều gì?',
        slug: 'mon-qua-ban-tang-noi-len-dieu-gi',
        image: '/images/articles/news/news-mon-qua.png',
        summary: 'Món quà bạn tặng đang "nói" gì với cô ấy? Ưu đãi nhỏ, yêu thương to.',
        content: `Món quà bạn tặng đang "nói" gì với cô ấy? 💌

✨ Ưu đãi nhỏ, yêu thương to:
🌷 Đơn từ 500K → Tặng kèm thiệp xinh + bao lì xì
🌷 Đơn từ 800K → Giảm thêm 5% + Free ship

💎 NHẪN = "Anh muốn gắn bó với em"
💎 DÂY CHUYỀN = "Em luôn ở trong tim anh"  
💎 LẮC TAY = "Anh luôn bên cạnh em"
💎 BÔNG TAI = "Anh muốn em luôn tỏa sáng"

Mỗi món trang sức đều mang một thông điệp riêng. Hãy chọn món quà phù hợp nhất để "nói" thay lời yêu thương của bạn! 💙`,
        type: 'Tin Tức',
        author: 'Tâm'
    },
    {
        title: 'Checklist quà Valentine cho "người hay quên"',
        slug: 'checklist-qua-valentine-cho-nguoi-hay-quen',
        image: '/images/articles/news/news-checklist.png',
        summary: 'Không cần hoàn hảo. Chỉ cần đừng quên. Hãy để Jensy chuẩn bị giúp bạn.',
        content: `🎁 Không cần hoàn hảo.
Chỉ cần đừng quên.
Hãy để Jensy chuẩn bị giúp bạn

✨ Ưu đãi nhỏ, yêu thương to:
🌷 Đơn từ 500K → Tặng kèm thiệp xinh + bao lì xì
🌷 Đơn từ 800K → Giảm thêm 5% + Free ship

CHECKLIST QUÀ VALENTINE:
☐ Dây chuyền bạc đẹp → Chọn ngay
☐ Nhẫn đôi tình yêu → Chọn ngay
☐ Lắc tay bạc xinh → Chọn ngay
☐ Set quà tặng combo → Chọn ngay
☐ Viết thiệp theo yêu cầu → Miễn phí
☐ Gói quà cao cấp → Miễn phí

Đặt trước 3 ngày để kịp giao đúng ngày Valentine nhé! 💕`,
        type: 'Tin Tức',
        author: 'Tâm'
    },
    {
        title: 'Lịch Làm Việc Tết Bính Ngọ 2026',
        slug: 'lich-lam-viec-tet-binh-ngo-2026',
        image: '/images/articles/news/news-lich-tet.png',
        summary: 'Chăm sóc khách hàng và tư vấn sản phẩm vẫn hoạt động xuyên dịp Tết.',
        content: `1. Chăm sóc khách hàng và tư vấn sản phẩm vẫn hoạt động xuyên dịp Tết.

2. Thời gian Ngừng Nhận và Giao đơn hàng: 15/2 - 25/2/2026

3. Thời gian bắt đầu nhận và giao đơn hàng trở lại: Từ 26/2/2026

📌 LƯU Ý:
- Đơn hàng đặt trước 14/2 sẽ được giao trước Tết
- Đơn hàng đặt từ 15/2 - 25/2 sẽ được xử lý từ 26/2
- CSKH vẫn trả lời tin nhắn trong dịp Tết (có thể chậm hơn bình thường)

🧧 ƯU ĐÃI TẾT:
- Giảm 10% tất cả sản phẩm
- Tặng bao lì xì cho mọi đơn hàng
- Miễn phí ship toàn quốc

Jensy chúc Quý Khách năm mới An Khang Thịnh Vượng! 🎊`,
        type: 'Tin Tức',
        author: 'NGUYỄN MINH NHÂN'
    },
    {
        title: 'Valentine Đến Nhà, Jensy Trao Quà',
        slug: 'valentine-den-nha-jensy-trao-qua',
        image: '/images/articles/news/news-valentine-gift.png',
        summary: 'Valentine là ngày để trao nhau những món bạc nhỏ mà ý nghĩa lớn.',
        content: `💘 Người ta bảo Valentine là ngày của hoa hồng đỏ và socola ngọt.
Nhưng với Jensy, Valentine là ngày để trao nhau những món bạc nhỏ mà ý nghĩa lớn.

🎁 CHƯƠNG TRÌNH ĐẶC BIỆT:
- Giao hàng ĐÚNG NGÀY 14/2 (đặt trước 12/2)
- Miễn phí gói quà Valentine sang trọng
- Tặng thiệp viết tay theo yêu cầu
- Tặng hoa hồng sáp cho đơn từ 800K

💎 GỢI Ý QUÀ TẶNG:
1. Set Dây Chuyền + Bông Tai (combo tiết kiệm 10%)
2. Nhẫn Đôi "Forever" (best seller mùa Valentine)
3. Set Quà Tặng Premium (full box sang trọng)

Đừng để Valentine qua đi mà không có gì đặc biệt! 💕`,
        type: 'Tin Tức',
        author: 'BÌNH DƯƠNG THÁI'
    },
    {
        title: '✨Happy New Year 2026✨',
        slug: 'happy-new-year-2026',
        image: '/images/articles/news/news-happy-newyear.png',
        summary: 'JENSY trân trọng gửi đến quý khách hàng lời chúc năm mới. Sức khỏe dồi dào – An yên trọn vẹn.',
        content: `Happy New Year 2026 ✨

JENSY trân trọng gửi đến quý khách hàng lời chúc năm mới
💛 Sức khỏe dồi dào – An yên trọn vẹn
💛 Vạn sự như ý – Tỏa sáng rạng ngời

Năm 2025 đã là một năm tuyệt vời với Jensy:
- Phục vụ hơn 15.000 khách hàng mới
- Ra mắt 50+ mẫu trang sức mới
- Nhận được 99% feedback tích cực

Năm 2026, Jensy hứa sẽ mang đến nhiều bộ sưu tập đẹp hơn, chất lượng hơn!

Cảm ơn bạn đã luôn tin tưởng và đồng hành! 💙`,
        type: 'Tin Tức',
        author: 'Uyên'
    },
    {
        title: 'Giáng Sinh Rộn Ràng, Qùa Tặng Ngập Tràn 🎄',
        slug: 'giang-sinh-ron-rang-qua-tang-ngap-tran',
        image: '/images/articles/news/news-christmas.png',
        summary: 'Giáng Sinh không chỉ là mùa của ánh đèn, của những bài hát vui tươi mà còn là mùa của sự sẻ chia.',
        content: `🎄 Giáng Sinh Rộn Ràng – Giảm Giá Ngập Tràn Cùng Trang Sức Bạc JENSY

Giáng Sinh không chỉ là mùa của ánh đèn, của những bài hát vui tươi mà còn là mùa của sự sẻ chia và trao tặng yêu thương.

🎁 ƯU ĐÃI GIÁNG SINH:
- Giảm 20% toàn bộ sản phẩm (24-25/12)
- Giảm 15% cho đơn từ 500K (20-26/12)
- Miễn phí gói quà Giáng Sinh
- Tặng thiệp Noel xinh xắn

🌟 TOP SẢN PHẨM BÁN CHẠY MÙA GIÁNG SINH:
1. Set Quà Tặng "Merry Christmas" 
2. Dây Chuyền Ngôi Sao
3. Bông Tai Bông Tuyết
4. Nhẫn Đôi tình nhân

Merry Christmas & Happy New Year! 🎄✨`,
        type: 'Tin Tức',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: 'Chúc Mừng Năm Mới Ất Tỵ 2025',
        slug: 'chuc-mung-nam-moi-at-ty-2025',
        image: '/images/articles/news/news-tet-2025.png',
        summary: 'Jensy xin gửi lời chúc đến tất cả quý khách hàng một năm mới An Khang – Thịnh Vượng – Hạnh Phúc!',
        content: `Jensy xin gửi lời chúc đến tất cả quý khách hàng một năm mới An Khang – Thịnh Vượng – Hạnh Phúc! ❤️

Chúc mọi người năm Ất Tỵ 2025:
🐍 Rắn vàng mang tài lộc
🧧 Phú quý đầy nhà
💎 Tỏa sáng như trang sức Jensy

Năm 2024, Jensy đã đồng hành cùng hàng ngàn khách hàng. Cảm ơn các bạn đã tin tưởng và ủng hộ!

🎊 ƯU ĐÃI TẾT ẤT TỴ:
- Flash Sale giảm đến 30% (Mùng 1-3 Tết)
- Tặng bao lì xì may mắn
- Miễn phí ship toàn quốc`,
        type: 'Tin Tức',
        author: 'PHẠM HẠ TUYÊN'
    },
    {
        title: '🌸 ĐEO GÌ ĐI CHƠI TẾT? 🌸',
        slug: 'deo-gi-di-choi-tet',
        image: '/images/articles/news/news-deo-tet.png',
        summary: 'Tết Nguyên Đán sắp đến rồi! Bạn đã chuẩn bị gì để tỏa sáng trong những ngày lễ hội chưa?',
        content: `Tết Nguyên Đán sắp đến rồi! Bạn đã chuẩn bị gì để tỏa sáng trong những ngày lễ hội chưa?

Đừng quên thêm chút "𝑙𝑎̂́𝑝 𝑙𝑎́𝑛ℎ" cho outfit Tết của bạn nhé!

🌸 GỢI Ý TRANG SỨC ĐI CHƠI TẾT:

1. ÁO DÀI + Dây chuyền bạc mặt ngọc
→ Thanh lịch, quý phái

2. ĐẦM PARTY + Bông tai kim cương Moissanite
→ Lấp lánh, nổi bật

3. ÁO KHOÁC + Lắc tay bạc tinh tế
→ Cool ngầu, cá tính

4. ĐỒ ĐÔI + Set nhẫn đôi/dây chuyền đôi
→ Ngọt ngào, đáng yêu

💝 ƯU ĐÃI TẾT: Giảm 10% + Miễn phí ship đơn từ 500K

Jensy - Lấp Lánh Em Xinh 🌸`,
        type: 'Tin Tức',
        author: 'PHẠM HẠ TUYÊN'
    }
];

// Gộp tất cả bài viết
const allPosts = [...kiemDinhPosts, ...feedbackPosts, ...huongDanPosts, ...tinTucPosts];

async function seedData() {
    try {
        await mongoose.connect(process.env.MongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB.');

        // Xóa dữ liệu post cũ để seed lại với dữ liệu mới đầy đủ
        console.log('Removing old posts...');
        await Post.deleteMany({});
        
        console.log('Seeding products...');
        for (let item of products) {
            const check = await Product.findOne({ name: item.name });
            if (!check) {
                await Product.create(item);
                console.log(`+ Created product: ${item.name}`);
            } else {
                console.log(`- Product exists: ${item.name}`);
            }
        }

        console.log('\nSeeding posts (24 bài viết)...');
        for (let item of allPosts) {
            try {
                await Post.create(item);
                console.log(`+ Created post [${item.type}]: ${item.title}`);
            } catch (err) {
                console.log(`! Error creating post "${item.title}":`, err.message);
            }
        }

        // Thống kê
        const stats = await Post.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        console.log('\n📊 Thống kê bài viết:');
        stats.forEach(s => console.log(`  ${s._id}: ${s.count} bài`));
        console.log(`  Tổng: ${stats.reduce((a, b) => a + b.count, 0)} bài`);

        console.log('\n✅ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
