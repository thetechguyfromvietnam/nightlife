import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { COUNTRY_CODES } from './countryCodes'

const currentYear = new Date().getFullYear()

const MUSIC_FILTERS = [
  { value: 'all', label: { en: 'All styles', vi: 'Tất cả thể loại' } },
  { value: 'EDM', label: { en: 'EDM', vi: 'EDM' } },
  { value: 'House', label: { en: 'House', vi: 'House' } },
  { value: 'Deep House', label: { en: 'Deep House', vi: 'Deep House' } },
  { value: 'Techno', label: { en: 'Techno', vi: 'Techno' } },
  { value: 'Hip Hop', label: { en: 'Hip Hop', vi: 'Hip Hop' } },
  { value: 'R&B', label: { en: 'R&B', vi: 'R&B' } },
  { value: 'Pop', label: { en: 'Pop', vi: 'Pop' } },
  { value: 'K-Pop', label: { en: 'K-Pop', vi: 'K-Pop' } },
  { value: 'Latin', label: { en: 'Latin', vi: 'Latin' } },
  { value: 'Reggaeton', label: { en: 'Reggaeton', vi: 'Reggaeton' } },
  { value: 'Afrobeats', label: { en: 'Afrobeats', vi: 'Afrobeats' } },
  { value: 'Trap', label: { en: 'Trap', vi: 'Trap' } },
  { value: 'Bass', label: { en: 'Bass', vi: 'Bass' } },
  { value: 'Commercial', label: { en: 'Commercial', vi: 'Commercial' } },
  { value: 'Top 40', label: { en: 'Top 40', vi: 'Top 40' } },
]

const CITY_OPTIONS = [
  { value: 'Ho Chi Minh City', label: { en: 'Ho Chi Minh City', vi: 'TP. Hồ Chí Minh' } },
  { value: 'coming-hanoi', label: { en: 'Hanoi • Coming soon', vi: 'Hà Nội • Sắp ra mắt' }, disabled: true },
  { value: 'coming-danang', label: { en: 'Da Nang • Coming soon', vi: 'Đà Nẵng • Sắp ra mắt' }, disabled: true },
]

const TEXT = {
  en: {
    brandTagline: 'Curated safe nightlife for Vietnam travelers',
    header: {
      concierge: '24/7 Concierge',
      planNight: 'Plan your night',
      barsClubs: 'Bars & Clubs',
      restaurants: 'Restaurants & Beer',
      about: 'About',
    },
    hero: {
      eyebrow: 'Curated nightlife • Safety first',
      titleLine1: 'Book Saigon nightlife',
      titleLine2: 'with music-led safe arrivals.',
      lead:
        'Discover vetted venues across Ho Chi Minh City with Vietnamese-led concierge teams, multilingual hosts, and trusted transport designed for visiting travelers.',
      stats: [
        { value: '15+', label: 'Saigon partner venues live' },
        { value: '98%', label: 'Verified traveler safety score' },
        { value: '2 cities', label: 'Hanoi & Da Nang launching soon' },
      ],
    },
    booking: {
      title: 'Night itinerary builder',
      subtitle: 'Plan your night: warm up → bar hopping (1-3 bars)',
      fields: {
        name: 'Your name',
        phone: 'Phone number',
        city: 'City',
        music: 'Music focus',
        date: 'Night of',
        group: 'Group size',
        warmUp: 'Warm up spot',
        bars: 'Bars & clubs',
        budget: 'Budget',
      },
      guestSingle: 'guest',
      guestPlural: 'guests',
      cta: 'Build itinerary',
      note: 'Hanoi & Da Nang concierge routes open soon',
      warmUpOptions: {
        biaHoi: 'Bia Hơi (Local beer)',
        sevenEleven: '7-Eleven',
        streetFood: 'Street food',
        none: 'Skip warm up',
      },
      itinerary: {
        step1: 'Warm up',
        step2: 'Bar hopping',
        addBar: 'Add bar',
        removeBar: 'Remove',
        estimatedBudget: 'Estimated budget',
        perPerson: 'per person',
      },
    },
    citySection: {
      eyebrow: 'Recommended for you',
      title: 'Safety-first venues in',
    },
    chips: {
      all: 'All styles',
    },
    venue: {
      reviews: 'verified reviews',
      planSafe: 'Plan safe arrival',
    },
    safety: {
      eyebrow: 'Why travelers trust us',
      title: 'Safety layers built for nightlife in Vietnam',
      items: [
        {
          title: 'Guardian-night hosts',
          body: 'Trained bilingual hosts based in Saigon meet you on arrival, manage your table, and stay on-call until you return safely to your hotel.',
        },
        {
          title: 'Verified transport',
          body: 'Private drivers, verified Grab partners, and walking escorts are pre-checked nightly with live tracking and guest confirmation.',
        },
        {
          title: '24/7 concierge',
          body: 'On-demand translators, consular escalation support, and instant re-booking if plans change—no matter the hour.',
        },
        {
          title: 'Trusted data',
          body: 'We audit venues weekly for crowd control, drink safety practices, and inclusion standards with local authorities to keep every guest comfortable.',
        },
      ],
    },
    gallery: {
      eyebrow: 'Nightclub photo atlas',
      title: 'See tonight’s energy across Saigon nightclubs',
      body: 'Swipe through concierge-captured highlights to preview the vibe at our verified nightlife partners before you arrive.',
      loading: 'Loading nightclubs…',
      empty: 'Nightclub gallery will appear once data is available.',
      error: 'Unable to load nightclub gallery. Please try again later.',
      imageCountSuffix: 'shots',
      controls: {
        prev: 'Previous photo',
        next: 'Next photo',
      },
      photoLabel: 'Photo',
      ofLabel: 'of',
    },
    drawer: {
      eyebrow: 'Your safe night',
      slotLabel: 'Arrival slot',
      slotPlaceholder: 'Select a slot to reserve',
      dateLabel: 'Date',
      groupLabel: 'Group',
      languagesLabel: 'Languages supported',
      notice: [
        'We hold your table, verify ID requirements, and schedule a safe return ride.',
        'No upfront charge. A concierge confirms within 15 minutes.',
      ],
      ctaConfirm: 'Confirm booking',
      ctaDisabled: 'Select arrival slot',
    },
    success: {
      title: 'Booking confirmed!',
      subtitle: 'Your night itinerary has been submitted',
      message: 'We will contact you within 15 minutes to confirm your booking details.',
      details: 'Booking details',
      backToHome: 'Plan another night',
      contact: 'Need help? Contact us',
    },
    footer: {
      tagline: 'Certified nightlife planning for travelers across Vietnam.',
      links: [
        { label: 'Cities', href: '#' },
        { label: 'Safety charter', href: '#' },
        { label: 'Membership', href: '#' },
        { label: 'Press', href: '#' },
      ],
      metaLine1: `© ${currentYear} Atlas Experiences Vietnam`,
      emergency: 'Emergency line: +84 28 7100 1122',
    },
  },
  vi: {
    brandTagline: 'Nightlife an toàn tuyển chọn cho du khách tại Việt Nam',
    header: {
      concierge: 'Concierge 24/7',
      planNight: 'Lên kế hoạch đêm nay',
      barsClubs: 'Bar & Club Sài Gòn',
      restaurants: 'Nhà hàng bia nhậu',
      about: 'Giới thiệu',
    },
    hero: {
      eyebrow: 'Nightlife tuyển chọn • An toàn là ưu tiên',
      titleLine1: 'Book nightlife Sài Gòn',
      titleLine2: 'với hành trình đón tiếp an toàn theo gu nhạc.',
      lead:
        'Khám phá các địa điểm được kiểm duyệt tại TP. Hồ Chí Minh cùng concierge người Việt, host đa ngôn ngữ và dịch vụ di chuyển tin cậy dành cho khách quốc tế.',
      stats: [
        { value: '15+', label: 'Đối tác nightlife Sài Gòn' },
        { value: '98%', label: 'Điểm an toàn từ du khách' },
        { value: '2 thành phố', label: 'Hà Nội & Đà Nẵng sắp ra mắt' },
      ],
    },
    booking: {
      title: 'Lịch trình buổi tối',
      subtitle: 'Lên kế hoạch: warm up → bar hopping (1-3 bars)',
      fields: {
        name: 'Tên của bạn',
        phone: 'Số điện thoại',
        city: 'Thành phố',
        music: 'Dòng nhạc',
        date: 'Đêm tham gia',
        group: 'Số khách',
        warmUp: 'Điểm warm up',
        bars: 'Bars & clubs',
        budget: 'Ngân sách',
      },
      guestSingle: 'khách',
      guestPlural: 'khách',
      cta: 'Tạo lịch trình',
      note: 'Concierge Hà Nội & Đà Nẵng sẽ mở sớm',
      warmUpOptions: {
        biaHoi: 'Bia Hơi',
        sevenEleven: '7-Eleven',
        streetFood: 'Đồ ăn đường phố',
        none: 'Bỏ qua warm up',
      },
      itinerary: {
        step1: 'Warm up',
        step2: 'Bar hopping',
        addBar: 'Thêm bar',
        removeBar: 'Xóa',
        estimatedBudget: 'Ngân sách ước tính',
        perPerson: 'mỗi người',
      },
    },
    citySection: {
      eyebrow: 'Gợi ý cho bạn',
      title: 'Địa điểm an toàn tại',
    },
    chips: {
      all: 'Tất cả thể loại',
    },
    venue: {
      reviews: 'đánh giá xác thực',
      planSafe: 'Đặt lịch đón an toàn',
    },
    safety: {
      eyebrow: 'Vì sao du khách tin tưởng',
      title: 'Lớp an toàn riêng cho nightlife Việt Nam',
      items: [
        {
          title: 'Host đồng hành',
          body: 'Host song ngữ tại Sài Gòn đón bạn tại điểm hẹn, chăm sóc bàn tiệc và túc trực cho đến khi bạn về khách sạn an toàn.',
        },
        {
          title: 'Di chuyển kiểm chứng',
          body: 'Tài xế riêng, đối tác Grab xác minh và đội hộ tống bộ hành được kiểm tra hằng đêm cùng hệ thống theo dõi trực tiếp.',
        },
        {
          title: 'Concierge 24/7',
          body: 'Thông dịch viên tức thời, hỗ trợ liên hệ lãnh sự và đổi lịch tức thì nếu kế hoạch thay đổi – bất kể thời gian.',
        },
        {
          title: 'Dữ liệu tin cậy',
          body: 'Mỗi tuần chúng tôi đánh giá địa điểm về kiểm soát đám đông, tiêu chuẩn đồ uống và tính hòa nhập cùng cơ quan địa phương.',
        },
      ],
    },
    gallery: {
      eyebrow: 'Thư viện ảnh nightlife',
      title: 'Xem năng lượng các nightclub Sài Gòn tối nay',
      body: 'Lướt qua bộ ảnh concierge tuyển chọn để cảm nhận vibe tại các đối tác nightlife trước khi bạn đến.',
      loading: 'Đang tải dữ liệu nightclub…',
      empty: 'Thư viện ảnh sẽ xuất hiện khi có dữ liệu.',
      error: 'Không thể tải thư viện ảnh nightclub. Vui lòng thử lại sau.',
      imageCountSuffix: 'ảnh',
      controls: {
        prev: 'Ảnh trước',
        next: 'Ảnh tiếp theo',
      },
      photoLabel: 'Ảnh',
      ofLabel: 'trên',
    },
    drawer: {
      eyebrow: 'Đêm an toàn của bạn',
      slotLabel: 'Khung giờ đến',
      slotPlaceholder: 'Chọn khung giờ để giữ chỗ',
      dateLabel: 'Ngày',
      groupLabel: 'Nhóm',
      languagesLabel: 'Ngôn ngữ hỗ trợ',
      notice: [
        'Chúng tôi giữ bàn, kiểm tra giấy tờ và sắp xếp chuyến về an toàn.',
        'Không cần cọc. Concierge liên hệ xác nhận trong 15 phút.',
      ],
      ctaConfirm: 'Xác nhận đặt chỗ',
      ctaDisabled: 'Chọn khung giờ đến',
    },
    success: {
      title: 'Đặt chỗ thành công!',
      subtitle: 'Lịch trình buổi tối của bạn đã được gửi',
      message: 'Chúng tôi sẽ liên hệ với bạn trong vòng 15 phút để xác nhận chi tiết đặt chỗ.',
      details: 'Chi tiết đặt chỗ',
      backToHome: 'Lên kế hoạch đêm khác',
      contact: 'Cần hỗ trợ? Liên hệ chúng tôi',
    },
    footer: {
      tagline: 'Nền tảng nightlife an toàn cho du khách khắp Việt Nam.',
      links: [
        { label: 'Thành phố', href: '#' },
        { label: 'Cam kết an toàn', href: '#' },
        { label: 'Thành viên', href: '#' },
        { label: 'Báo chí', href: '#' },
      ],
      metaLine1: `© ${currentYear} Atlas Experiences Vietnam`,
      emergency: 'Đường dây khẩn: +84 28 7100 1122',
    },
  },
}

const NIGHTCLUB_IMAGE_LIMIT = 12

const VENUES = {
  en: [
    {
      id: 'skyline-lounge',
      name: 'Skyline Pulse Terrace',
      city: 'Ho Chi Minh City',
      cityLabel: 'Ho Chi Minh City',
      neighborhood: 'District 1 • Saigon Centre',
      rating: 4.9,
      reviewCount: 286,
      genres: ['House', 'Nu Disco', 'City Pop'],
      genresDisplay: ['House', 'Nu Disco', 'City Pop'],
      vibe: 'Rooftop lounge • Skyline glass domes',
      description:
        'Sunset-soaked rooftop with vinyl selectors, skyline views, and bilingual hosts guiding every arrival and departure.',
      safetyHighlights: [
        'Night guardians escort guests curb-to-table',
        'Verified Grab Car and limousine partners',
        'English, Korean, and Vietnamese concierge on comms',
      ],
      image:
        'https://images.unsplash.com/photo-1500043202583-4a1334b69ebc?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['19:00', '20:30', '22:30'],
      averageSpend: '950,000₫ / guest',
      languages: ['English', 'Vietnamese', 'Korean'],
    },
    {
      id: 'district-supperclub',
      name: 'District Supperclub',
      city: 'Ho Chi Minh City',
      cityLabel: 'Ho Chi Minh City',
      neighborhood: 'District 3 • Turtle Lake',
      rating: 4.8,
      reviewCount: 342,
      genres: ['R&B', 'Afrobeats', 'Hip Hop'],
      genresDisplay: ['R&B', 'Afrobeats', 'Hip Hop'],
      vibe: 'Low-lit supperclub • Live percussion',
      description:
        'Hosted dinner-to-dance experience with live percussion sets, curated cocktails, and private safe-drop coordination for foreigners.',
      safetyHighlights: [
        'Arrival verification at hotel lobby',
        'Dedicated female-forward guardian team',
        'Passport-ready fast-track at venue entrance',
      ],
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['19:30', '21:00', '23:00'],
      averageSpend: '1,150,000₫ / guest',
      languages: ['English', 'Vietnamese', 'French'],
    },
    {
      id: 'afterdark-warehouse',
      name: 'Afterdark Warehouse',
      city: 'Ho Chi Minh City',
      cityLabel: 'Ho Chi Minh City',
      neighborhood: 'District 4 • Riverside Creative Hub',
      rating: 4.7,
      reviewCount: 198,
      genres: ['Techno', 'Minimal', 'Industrial'],
      genresDisplay: ['Techno', 'Minimal', 'Industrial'],
      vibe: 'Converted warehouse • Holographic light rig',
      description:
        'Immersive warehouse club with certified crowd control, pre-registered entry, and silent translation devices for visiting ravers.',
      safetyHighlights: [
        'On-site medical & hydration lounge',
        'Trusted night riders stationed outside',
        'Multi-language emergency escalation protocol',
      ],
      image:
        'https://images.unsplash.com/photo-1551711677-d09402bbc0f8?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['21:30', '23:00', '01:00'],
      averageSpend: '820,000₫ / guest',
      languages: ['English', 'Vietnamese', 'Japanese'],
    },
  ],
  vi: [
    {
      id: 'skyline-lounge',
      name: 'Skyline Pulse Terrace',
      city: 'Ho Chi Minh City',
      cityLabel: 'TP. Hồ Chí Minh',
      neighborhood: 'Quận 1 • Saigon Centre',
      rating: 4.9,
      reviewCount: 286,
      genres: ['House', 'Nu Disco', 'City Pop'],
      genresDisplay: ['House', 'Nu Disco', 'City Pop'],
      vibe: 'Rooftop lounge • Mái vòm kính toàn cảnh',
      description:
        'Rooftop ngập nắng hoàng hôn với DJ vinyl, view skyline và host song ngữ đồng hành từ lúc đến cho đến khi bạn trở về.',
      safetyHighlights: [
        'Night guardian đưa khách từ lề đường đến bàn',
        'Đối tác Grab & limousine đã xác minh',
        'Concierge tiếng Anh, Hàn, Việt luôn kết nối',
      ],
      image:
        'https://images.unsplash.com/photo-1500043202583-4a1334b69ebc?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['19:00', '20:30', '22:30'],
      averageSpend: '950.000₫ / khách',
      languages: ['Tiếng Anh', 'Tiếng Việt', 'Tiếng Hàn'],
    },
    {
      id: 'district-supperclub',
      name: 'District Supperclub',
      city: 'Ho Chi Minh City',
      cityLabel: 'TP. Hồ Chí Minh',
      neighborhood: 'Quận 3 • Hồ Con Rùa',
      rating: 4.8,
      reviewCount: 342,
      genres: ['R&B', 'Afrobeats', 'Hip Hop'],
      genresDisplay: ['R&B', 'Afrobeats', 'Hip Hop'],
      vibe: 'Supperclub ánh sáng thấp • Trống live',
      description:
        'Trải nghiệm dinner-to-dance với bộ gõ live, cocktail tuyển chọn và đội điều phối đưa đón an toàn dành cho khách quốc tế.',
      safetyHighlights: [
        'Xác nhận đón tại sảnh khách sạn',
        'Đội guardian nữ đồng hành trọn đêm',
        'Lối vào ưu tiên chuẩn bị sẵn visa/passport',
      ],
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['19:30', '21:00', '23:00'],
      averageSpend: '1.150.000₫ / khách',
      languages: ['Tiếng Anh', 'Tiếng Việt', 'Tiếng Pháp'],
    },
    {
      id: 'afterdark-warehouse',
      name: 'Afterdark Warehouse',
      city: 'Ho Chi Minh City',
      cityLabel: 'TP. Hồ Chí Minh',
      neighborhood: 'Quận 4 • Riverside Creative Hub',
      rating: 4.7,
      reviewCount: 198,
      genres: ['Techno', 'Minimal', 'Industrial'],
      genresDisplay: ['Techno', 'Minimal', 'Industrial'],
      vibe: 'Warehouse chuyển đổi • Hệ ánh sáng hologram',
      description:
        'Warehouse immersive với kiểm soát đám đông chuẩn, check-in trước và thiết bị phiên dịch dành cho raver quốc tế.',
      safetyHighlights: [
        'Khu y tế & tiếp nước ngay trong venue',
        'Đội night riders trực chờ bên ngoài',
        'Quy trình khẩn cấp đa ngôn ngữ',
      ],
      image:
        'https://images.unsplash.com/photo-1551711677-d09402bbc0f8?auto=format&fit=crop&w=1200&q=80',
      upcomingSlots: ['21:30', '23:00', '01:00'],
      averageSpend: '820.000₫ / khách',
      languages: ['Tiếng Anh', 'Tiếng Việt', 'Tiếng Nhật'],
    },
  ],
}

const groupSizeOptions = [1, 2, 3, 4, 5, 6, 8, 10]


function App() {
  const [language, setLanguage] = useState('en')
  const [selectedCity, setSelectedCity] = useState('Ho Chi Minh City')
  const [selectedMusic, setSelectedMusic] = useState('all')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [groupSize, setGroupSize] = useState(2)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedVenueId, setSelectedVenueId] = useState(VENUES.en[0].id)
  const [warmUpVenue, setWarmUpVenue] = useState(null)
  const [selectedBars, setSelectedBars] = useState([])
  const [budget, setBudget] = useState(1000000)
  const [customerName, setCustomerName] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+84')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Hàm tự động detect mã quốc gia từ số điện thoại
  const detectCountryCode = useCallback((phoneValue) => {
    if (!phoneValue || !phoneValue.startsWith('+')) {
      return null
    }

    // Sắp xếp mã quốc gia theo độ dài giảm dần để match mã dài trước
    const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)
    
    // Tìm mã quốc gia khớp với phần đầu của số điện thoại
    for (const country of sortedCodes) {
      if (phoneValue.startsWith(country.code)) {
        return country.code
      }
    }
    
    return null
  }, [])
  const [showSuccess, setShowSuccess] = useState(false)
  const [nightclubs, setNightclubs] = useState([])
  const [selectedNightclubId, setSelectedNightclubId] = useState(null)
  const [activeNightclubSlide, setActiveNightclubSlide] = useState(0)
  const [isNightclubLoading, setIsNightclubLoading] = useState(false)
  const [nightclubError, setNightclubError] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const copy = useMemo(() => TEXT[language], [language])
  const currentVenues = useMemo(() => VENUES[language], [language])

  // Tạo venues từ nightclubs với genres
  const venuesFromNightclubs = useMemo(() => {
    return nightclubs.map((club) => ({
      id: club.id,
      name: club.name,
      city: 'Ho Chi Minh City',
      cityLabel: language === 'en' ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh',
      neighborhood: language === 'en' ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh',
      rating: 4.5,
      reviewCount: 0,
      genres: club.genres || [],
      genresDisplay: club.genres || [],
      vibe: language === 'en' ? 'Verified Nightlife Venue' : 'Địa điểm Nightlife đã xác minh',
      description: language === 'en' 
        ? 'Premium nightlife venue with curated music and safe arrival coordination.'
        : 'Địa điểm nightlife cao cấp với dòng nhạc tuyển chọn và dịch vụ đón tiếp an toàn.',
      image: club.images && club.images.length > 0 ? club.images[0] : '',
      upcomingSlots: ['20:00', '22:00', '00:00'],
      averageSpend: language === 'en' ? '800,000₫ / guest' : '800.000₫ / khách',
      languages: language === 'en' ? ['English', 'Vietnamese'] : ['Tiếng Anh', 'Tiếng Việt'],
    }))
  }, [nightclubs, language])

  // Kết hợp venues từ VENUES và nightclubs
  const allVenues = useMemo(() => {
    return [...currentVenues, ...venuesFromNightclubs]
  }, [currentVenues, venuesFromNightclubs])

  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      const cityMatches = selectedCity === 'Ho Chi Minh City' ? venue.city === 'Ho Chi Minh City' : true
      const musicMatches = selectedMusic === 'all' ? true : (venue.genres && venue.genres.includes(selectedMusic))

      return cityMatches && musicMatches
    })
  }, [allVenues, selectedCity, selectedMusic])

  const selectedVenue = useMemo(() => {
    return allVenues.find((venue) => venue.id === selectedVenueId) ?? allVenues[0]
  }, [allVenues, selectedVenueId])

  const selectedNightclub = useMemo(() => {
    return nightclubs.find((club) => club.id === selectedNightclubId) ?? null
  }, [nightclubs, selectedNightclubId])

  useEffect(() => {
    const exists = allVenues.find((venue) => venue.id === selectedVenueId)
    if (!exists && allVenues.length > 0) {
      setSelectedVenueId(allVenues[0].id)
      setSelectedSlot(null)
    }
  }, [allVenues, selectedVenueId])

  useEffect(() => {
    let ignore = false

    const loadNightclubs = async () => {
      setIsNightclubLoading(true)
      try {
        const response = await fetch('/nightclub-data/nightclubs.json')
        if (!response.ok) {
          throw new Error('Failed to load nightlife gallery')
        }
        const data = await response.json()
        if (ignore) return
        setNightclubs(data)
        if (data.length > 0) {
          setSelectedNightclubId((current) => current ?? data[0].id)
        }
        setNightclubError(null)
      } catch (error) {
        if (!ignore) {
          setNightclubError(error.message)
        }
      } finally {
        if (!ignore) {
          setIsNightclubLoading(false)
        }
      }
    }

    loadNightclubs()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    setActiveNightclubSlide(0)
  }, [selectedNightclubId])

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  const handleSlotSelect = (venueId, slot) => {
    setSelectedVenueId(venueId)
    setSelectedSlot(slot)
  }

  // Throttle navigation để tránh lag khi click nhanh
  const navigationTimeoutRef = useRef(null)

  const handleNightclubPrev = useCallback(() => {
    if (navigationTimeoutRef.current) return
    if (!selectedNightclub || (selectedNightclub?.images?.length ?? 0) === 0) {
      return
    }
    setActiveNightclubSlide((prev) => {
      const total = selectedNightclub.images.length
      return (prev - 1 + total) % total
    })
    navigationTimeoutRef.current = setTimeout(() => {
      navigationTimeoutRef.current = null
    }, 150)
  }, [selectedNightclub])

  const handleNightclubNext = useCallback(() => {
    if (navigationTimeoutRef.current) return
    if (!selectedNightclub || (selectedNightclub?.images?.length ?? 0) === 0) {
      return
    }
    setActiveNightclubSlide((prev) => {
      const total = selectedNightclub.images.length
      return (prev + 1) % total
    })
    navigationTimeoutRef.current = setTimeout(() => {
      navigationTimeoutRef.current = null
    }, 150)
  }, [selectedNightclub])

  const handleNightclubThumbSelect = useCallback(
    (index) => {
      if (
        !selectedNightclub ||
        (selectedNightclub?.images?.length ?? 0) === 0 ||
        index < 0 ||
        index >= selectedNightclub.images.length
      ) {
        return
      }
      setActiveNightclubSlide(index)
    },
    [selectedNightclub]
  )

  const handleNightclubSelect = useCallback((clubId) => {
    setSelectedNightclubId(clubId)
  }, [])

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang)
  }, [])

  // Function to send itinerary to WhatsApp
  const sendItineraryToWhatsApp = useCallback(() => {
    const whatsappNumber = '84978270038' // Your WhatsApp number
    
    // Format the date
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Get selected bars/clubs names
    const selectedBarsNames = selectedBars
      .filter((id) => id)
      .map((id) => {
        const venue = allVenues.find((v) => v.id === id)
        return venue?.name
      })
      .filter(Boolean)

    // Build the message
    let message = `🎉 *New Nightlife Booking Request*\n\n`
    message += `*Customer Information:*\n`
    message += `👤 Name: ${customerName}\n`
    message += `📞 Phone: ${phoneCountryCode} ${phoneNumber}\n\n`
    
    message += `*Event Details:*\n`
    message += `📅 Date: ${formattedDate}\n`
    message += `👥 Group Size: ${groupSize} ${groupSize === 1 ? copy.booking.guestSingle : copy.booking.guestPlural}\n`
    
    if (selectedMusic !== 'all') {
      const musicLabel = MUSIC_FILTERS.find(f => f.value === selectedMusic)?.label[language] || selectedMusic
      message += `🎵 Music Focus: ${musicLabel}\n`
    }
    
    if (warmUpVenue) {
      message += `🍺 Warm Up: ${copy.booking.warmUpOptions[warmUpVenue]}\n`
    }
    
    if (selectedBarsNames.length > 0) {
      message += `\n*Selected Venues:*\n`
      selectedBarsNames.forEach((name, index) => {
        message += `${index + 1}. ${name}\n`
      })
    }
    
    message += `\n_Booking submitted via Nightlife Atlas website_`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    // Send to WhatsApp completely behind the scenes (no visible window for guest)
    // Use a hidden iframe approach that minimizes visibility
    try {
      // Create a hidden iframe to send the message
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.opacity = '0'
      iframe.style.pointerEvents = 'none'
      iframe.src = whatsappUrl
      
      document.body.appendChild(iframe)
      
      // Remove iframe after a short delay
      setTimeout(() => {
        try {
          if (iframe.parentNode) {
            document.body.removeChild(iframe)
          }
        } catch (e) {
          // Ignore if already removed
        }
      }, 2000)
    } catch (e) {
      // Fallback: use a very small, quickly-closing window positioned off-screen
      try {
        const whatsappWindow = window.open(
          whatsappUrl,
          '_blank',
          'width=1,height=1,left=-1000,top=-1000,noopener,noreferrer'
        )
        
        // Close immediately after opening (before user can see it)
        if (whatsappWindow) {
          setTimeout(() => {
            try {
              whatsappWindow.close()
            } catch (e) {
              // Ignore errors
            }
          }, 100)
        }
      } catch (e2) {
        // If all else fails, silently fail - don't interrupt user experience
        // The booking confirmation will still show to the guest
      }
    }
  }, [
    customerName,
    phoneCountryCode,
    phoneNumber,
    date,
    groupSize,
    selectedMusic,
    warmUpVenue,
    selectedBars,
    budget,
    allVenues,
    copy,
    language,
  ])

  const selectedCityLabel = useMemo(
    () =>
      CITY_OPTIONS.find((option) => option.value === selectedCity)?.label[language] ??
      CITY_OPTIONS[0].label[language],
    [selectedCity, language]
  )

  const activeNightclubImages = useMemo(() => {
    if (!selectedNightclub) {
      return []
    }
    return selectedNightclub.images.slice(0, NIGHTCLUB_IMAGE_LIMIT)
  }, [selectedNightclub])

  const activeNightclubTotal = activeNightclubImages.length

  const activeNightclubImageSrc = useMemo(() => {
    if (activeNightclubTotal === 0) return null
    return activeNightclubImages[activeNightclubSlide % activeNightclubTotal]
  }, [activeNightclubImages, activeNightclubSlide, activeNightclubTotal])

  // Page Components
  const BarsClubsPage = () => {
    const [clubImageIndices, setClubImageIndices] = useState({})

    const setClubImageIndex = (clubId, index) => {
      setClubImageIndices((prev) => ({ ...prev, [clubId]: index }))
    }

    const getClubImageIndex = (clubId) => clubImageIndices[clubId] || 0

    const nextImage = (clubId, totalImages) => {
      const current = getClubImageIndex(clubId)
      setClubImageIndex(clubId, (current + 1) % totalImages)
    }

    const prevImage = (clubId, totalImages) => {
      const current = getClubImageIndex(clubId)
      setClubImageIndex(clubId, (current - 1 + totalImages) % totalImages)
    }

    return (
      <section className="page-section">
        <div className="page-header">
          <h1>{language === 'en' ? 'Bars & Clubs in Saigon' : 'Bar & Club tại Sài Gòn'}</h1>
          <p className="page-subtitle">
            {language === 'en'
              ? `Discover ${nightclubs.length} verified nightlife venues in Ho Chi Minh City`
              : `Khám phá ${nightclubs.length} địa điểm nightlife đã xác minh tại TP. Hồ Chí Minh`}
          </p>
        </div>

        <div className="page-content">
          {isNightclubLoading ? (
            <div className="page-loading">
              {language === 'en' ? 'Loading venues...' : 'Đang tải địa điểm...'}
            </div>
          ) : nightclubError ? (
            <div className="page-error">
              {language === 'en' ? 'Failed to load venues' : 'Không thể tải địa điểm'}
            </div>
          ) : (
            <div className="venues-grid">
              {nightclubs.map((club) => {
                const currentIndex = getClubImageIndex(club.id)
                const hasMultipleImages = club.images && club.images.length > 1

                return (
                  <article key={club.id} className="venue-card-page">
                    <div className="venue-card-page__slider">
                      {club.images && club.images.length > 0 && (
                        <>
                          <div className="venue-card-page__slider-image">
                            <img
                              src={club.images[currentIndex]}
                              alt={`${club.name} ${currentIndex + 1}`}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1550043202583-4a1334b69ebc?auto=format&fit=crop&w=800&q=80'
                              }}
                            />
                            {hasMultipleImages && (
                              <>
                                <button
                                  className="venue-card-page__slider-nav venue-card-page__slider-nav--prev"
                                  onClick={() => prevImage(club.id, club.images.length)}
                                  aria-label={language === 'en' ? 'Previous image' : 'Ảnh trước'}
                                >
                                  ‹
                                </button>
                                <button
                                  className="venue-card-page__slider-nav venue-card-page__slider-nav--next"
                                  onClick={() => nextImage(club.id, club.images.length)}
                                  aria-label={language === 'en' ? 'Next image' : 'Ảnh tiếp theo'}
                                >
                                  ›
                                </button>
                              </>
                            )}
                            <div className="venue-card-page__slider-counter">
                              {currentIndex + 1} / {club.images.length}
                            </div>
                          </div>
                          <span className="venue-card-page__badge">
                            {language === 'en' ? 'Ho Chi Minh City' : 'TP. Hồ Chí Minh'}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="venue-card-page__content">
                      <header>
                        <h3>{club.name}</h3>
                        <p className="venue-card-page__vibe">
                          {language === 'en' ? 'Verified Nightlife Venue' : 'Địa điểm Nightlife đã xác minh'}
                        </p>
                      </header>
                      {club.genres && club.genres.length > 0 && (
                        <div className="venue-card-page__tags">
                          {club.genres.map((genre) => (
                            <span key={genre} className="venue-card-page__tag">
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="venue-card-page__meta">
                        <span>
                          {club.images?.length || 0} {language === 'en' ? 'photos available' : 'ảnh có sẵn'}
                        </span>
                      </div>
                      <button
                        className="secondary venue-card-page__button"
                        onClick={() => {
                          setCurrentPage('home')
                          setTimeout(() => {
                            document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth' })
                          }, 100)
                        }}
                      >
                        {copy.venue.planSafe}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    )
  }

  const RestaurantsPage = () => (
    <section className="page-section">
      <div className="page-header">
        <h1>{language === 'en' ? 'Restaurants & Beer Spots' : 'Nhà hàng & Quán bia nhậu'}</h1>
        <p className="page-subtitle">
          {language === 'en'
            ? 'Great places for food, drinks, and socializing in Saigon'
            : 'Những địa điểm tuyệt vời để ăn uống, nhậu và giao lưu tại Sài Gòn'}
        </p>
      </div>

      <div className="page-content">
        <div className="restaurants-grid">
          <div className="restaurant-card">
            <div className="restaurant-card__image">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                alt={language === 'en' ? 'Beer garden' : 'Vườn bia'}
                loading="lazy"
              />
            </div>
            <div className="restaurant-card__content">
              <h3>{language === 'en' ? 'Bia Hơi Street' : 'Bia Hơi đường phố'}</h3>
              <p className="restaurant-card__description">
                {language === 'en'
                  ? 'Experience authentic Vietnamese beer culture at local bia hoi spots. Fresh draft beer, street food, and vibrant atmosphere.'
                  : 'Trải nghiệm văn hóa bia Việt Nam đích thực tại các quán bia hơi địa phương. Bia tươi, đồ ăn đường phố và không khí sôi động.'}
              </p>
              <div className="restaurant-card__features">
                <span>🍺 {language === 'en' ? 'Fresh Draft Beer' : 'Bia tươi'}</span>
                <span>🍜 {language === 'en' ? 'Street Food' : 'Đồ ăn đường phố'}</span>
                <span>💰 {language === 'en' ? 'Affordable' : 'Giá rẻ'}</span>
              </div>
            </div>
          </div>

          <div className="restaurant-card">
            <div className="restaurant-card__image">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt={language === 'en' ? 'Restaurant' : 'Nhà hàng'}
                loading="lazy"
              />
            </div>
            <div className="restaurant-card__content">
              <h3>{language === 'en' ? 'Rooftop Bars & Restaurants' : 'Bar & Nhà hàng trên cao'}</h3>
              <p className="restaurant-card__description">
                {language === 'en'
                  ? 'Enjoy stunning city views while dining and drinking at Saigon\'s best rooftop venues. Perfect for groups and special occasions.'
                  : 'Tận hưởng view thành phố tuyệt đẹp khi ăn uống tại các địa điểm rooftop tốt nhất Sài Gòn. Hoàn hảo cho nhóm và dịp đặc biệt.'}
              </p>
              <div className="restaurant-card__features">
                <span>🌃 {language === 'en' ? 'City Views' : 'View thành phố'}</span>
                <span>🍽️ {language === 'en' ? 'Fine Dining' : 'Ẩm thực cao cấp'}</span>
                <span>🎉 {language === 'en' ? 'Group Friendly' : 'Thân thiện nhóm'}</span>
              </div>
            </div>
          </div>

          <div className="restaurant-card">
            <div className="restaurant-card__image">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
                alt={language === 'en' ? 'BBQ Restaurant' : 'Nhà hàng BBQ'}
                loading="lazy"
              />
            </div>
            <div className="restaurant-card__content">
              <h3>{language === 'en' ? 'BBQ & Hotpot Spots' : 'Quán BBQ & Lẩu'}</h3>
              <p className="restaurant-card__description">
                {language === 'en'
                  ? 'Gather with friends for Korean BBQ, Vietnamese hotpot, or grilled seafood. Great for late-night dining and socializing.'
                  : 'Tụ tập với bạn bè tại quán BBQ Hàn, lẩu Việt hoặc hải sản nướng. Tuyệt vời cho bữa tối muộn và giao lưu.'}
              </p>
              <div className="restaurant-card__features">
                <span>🔥 {language === 'en' ? 'Grilled Food' : 'Đồ nướng'}</span>
                <span>🍲 {language === 'en' ? 'Hotpot' : 'Lẩu'}</span>
                <span>👥 {language === 'en' ? 'Group Dining' : 'Ăn nhóm'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const AboutPage = () => (
    <section className="page-section">
      <div className="page-header">
        <h1>{language === 'en' ? 'About Nightlife Atlas' : 'Về Nightlife Atlas'}</h1>
        <p className="page-subtitle">
          {language === 'en'
            ? 'Your trusted guide to safe and curated nightlife experiences in Vietnam'
            : 'Hướng dẫn đáng tin cậy cho trải nghiệm nightlife an toàn và tuyển chọn tại Việt Nam'}
        </p>
      </div>

      <div className="page-content">
        <div className="about-content">
          <div className="about-section">
            <h2>{language === 'en' ? 'Our Mission' : 'Sứ mệnh của chúng tôi'}</h2>
            <p>
              {language === 'en'
                ? 'Nightlife Atlas is dedicated to providing travelers with safe, curated nightlife experiences across Vietnam. We partner with verified venues, provide bilingual hosts, and ensure every guest returns safely to their accommodation.'
                : 'Nightlife Atlas cam kết mang đến cho du khách trải nghiệm nightlife an toàn và tuyển chọn trên khắp Việt Nam. Chúng tôi hợp tác với các địa điểm đã xác minh, cung cấp host song ngữ và đảm bảo mọi khách trở về nơi ở an toàn.'}
            </p>
          </div>

          <div className="about-section">
            <h2>{language === 'en' ? 'Why Choose Us' : 'Tại sao chọn chúng tôi'}</h2>
            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature__icon">✓</div>
                <div>
                  <h3>{language === 'en' ? 'Verified Venues' : 'Địa điểm đã xác minh'}</h3>
                  <p>
                    {language === 'en'
                      ? 'All venues are regularly audited for safety, crowd control, and service quality.'
                      : 'Tất cả địa điểm được kiểm tra thường xuyên về an toàn, kiểm soát đám đông và chất lượng dịch vụ.'}
                  </p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature__icon">✓</div>
                <div>
                  <h3>{language === 'en' ? 'Bilingual Hosts' : 'Host song ngữ'}</h3>
                  <p>
                    {language === 'en'
                      ? 'Trained hosts speak multiple languages and stay with you throughout your night.'
                      : 'Host được đào tạo nói nhiều ngôn ngữ và đồng hành với bạn suốt đêm.'}
                  </p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature__icon">✓</div>
                <div>
                  <h3>{language === 'en' ? 'Safe Transport' : 'Di chuyển an toàn'}</h3>
                  <p>
                    {language === 'en'
                      ? 'Verified drivers and pre-arranged transport ensure you get home safely.'
                      : 'Tài xế đã xác minh và phương tiện được sắp xếp trước đảm bảo bạn về nhà an toàn.'}
                  </p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature__icon">✓</div>
                <div>
                  <h3>{language === 'en' ? '24/7 Support' : 'Hỗ trợ 24/7'}</h3>
                  <p>
                    {language === 'en'
                      ? 'Round-the-clock concierge support for any questions or emergencies.'
                      : 'Hỗ trợ concierge 24/7 cho mọi câu hỏi hoặc tình huống khẩn cấp.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>{language === 'en' ? 'Contact Us' : 'Liên hệ'}</h2>
            <div className="about-contact">
              <a
                href="https://wa.me/84978270038"
                target="_blank"
                rel="noopener noreferrer"
                className="primary"
              >
                {copy.header.concierge}
              </a>
              <p className="about-contact__note">
                {language === 'en'
                  ? 'Reach out via WhatsApp for instant assistance'
                  : 'Liên hệ qua WhatsApp để được hỗ trợ ngay lập tức'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="app">
      <header className="top-bar">
        <div className="brand">
          <img 
            src="/logo-circle-250kb.jpg" 
            alt="Nightlife Atlas" 
            className="brand-logo"
          />
          <div>
            <strong>Nightlife Atlas</strong>
            <small>{copy.brandTagline}</small>
          </div>
        </div>

        <nav className="top-nav">
          <button
            type="button"
            className={`top-nav__link ${currentPage === 'home' ? 'top-nav__link--active' : ''}`}
            onClick={() => {
              setCurrentPage('home')
              setMobileMenuOpen(false)
            }}
          >
            {language === 'en' ? 'Home' : 'Trang chủ'}
          </button>
          <button
            type="button"
            className={`top-nav__link ${currentPage === 'bars-clubs' ? 'top-nav__link--active' : ''}`}
            onClick={() => {
              setCurrentPage('bars-clubs')
              setMobileMenuOpen(false)
            }}
          >
            {copy.header.barsClubs}
          </button>
          <button
            type="button"
            className={`top-nav__link ${currentPage === 'restaurants' ? 'top-nav__link--active' : ''}`}
            onClick={() => {
              setCurrentPage('restaurants')
              setMobileMenuOpen(false)
            }}
          >
            {copy.header.restaurants}
          </button>
          <button
            type="button"
            className={`top-nav__link ${currentPage === 'about' ? 'top-nav__link--active' : ''}`}
            onClick={() => {
              setCurrentPage('about')
              setMobileMenuOpen(false)
            }}
          >
            {copy.header.about}
          </button>
        </nav>

        <nav className="top-actions">
          <div className="language-switch">
            <button
              className={language === 'en' ? 'ghost active' : 'ghost'}
              type="button"
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </button>
            <button
              className={language === 'vi' ? 'ghost active' : 'ghost'}
              type="button"
              onClick={() => handleLanguageChange('vi')}
            >
              VI
            </button>
          </div>
          <a
            href="https://wa.me/84978270038"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost top-actions__concierge"
          >
            {copy.header.concierge}
          </a>
          <button
            className="primary top-actions__cta"
            type="button"
            onClick={() => {
              setCurrentPage('home')
              setTimeout(() => {
                document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
          >
            {copy.header.planNight}
          </button>
          <button
            className="top-bar__mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={language === 'en' ? 'Toggle menu' : 'Mở menu'}
          >
            <span className={mobileMenuOpen ? 'active' : ''}></span>
            <span className={mobileMenuOpen ? 'active' : ''}></span>
            <span className={mobileMenuOpen ? 'active' : ''}></span>
          </button>
        </nav>

        {mobileMenuOpen && (
          <nav className="top-nav-mobile">
            <button
              type="button"
              className={`top-nav-mobile__link ${currentPage === 'home' ? 'top-nav-mobile__link--active' : ''}`}
              onClick={() => {
                setCurrentPage('home')
                setMobileMenuOpen(false)
              }}
            >
              {language === 'en' ? 'Home' : 'Trang chủ'}
            </button>
            <button
              type="button"
              className={`top-nav-mobile__link ${currentPage === 'bars-clubs' ? 'top-nav-mobile__link--active' : ''}`}
              onClick={() => {
                setCurrentPage('bars-clubs')
                setMobileMenuOpen(false)
              }}
            >
              {copy.header.barsClubs}
            </button>
            <button
              type="button"
              className={`top-nav-mobile__link ${currentPage === 'restaurants' ? 'top-nav-mobile__link--active' : ''}`}
              onClick={() => {
                setCurrentPage('restaurants')
                setMobileMenuOpen(false)
              }}
            >
              {copy.header.restaurants}
            </button>
            <button
              type="button"
              className={`top-nav-mobile__link ${currentPage === 'about' ? 'top-nav-mobile__link--active' : ''}`}
              onClick={() => {
                setCurrentPage('about')
                setMobileMenuOpen(false)
              }}
            >
              {copy.header.about}
            </button>
            <a
              href="https://wa.me/84978270038"
              target="_blank"
              rel="noopener noreferrer"
              className="top-nav-mobile__link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {copy.header.concierge}
            </a>
            <button
              className="primary top-nav-mobile__cta"
              type="button"
              onClick={() => {
                setCurrentPage('home')
                setMobileMenuOpen(false)
                setTimeout(() => {
                  document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
            >
              {copy.header.planNight}
            </button>
          </nav>
        )}
      </header>

      <main className="content">
        {currentPage === 'home' && (
          <>
            <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>
              {copy.hero.titleLine1}
              <span>{copy.hero.titleLine2}</span>
            </h1>
            <p className="lead">{copy.hero.lead}</p>

            <div className="hero-cta">
              <button
                className="primary hero-cta__button"
                type="button"
                onClick={() => {
                  document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {copy.header.planNight}
              </button>
              <a
                href="https://wa.me/84978270038"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary hero-cta__link"
              >
                {copy.header.concierge}
              </a>
            </div>

            <div className="stat-row">
              {copy.hero.stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature__icon">✓</div>
                <span>{language === 'en' ? 'Verified venues' : 'Địa điểm đã xác minh'}</span>
              </div>
              <div className="hero-feature">
                <div className="hero-feature__icon">✓</div>
                <span>{language === 'en' ? '24/7 Support' : 'Hỗ trợ 24/7'}</span>
              </div>
              <div className="hero-feature">
                <div className="hero-feature__icon">✓</div>
                <span>{language === 'en' ? 'Safe transport' : 'Di chuyển an toàn'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="booking-section">
          <div className="booking-card">
            <div className="booking-card__header">
              <h2>{copy.booking.title}</h2>
              <p>{copy.booking.subtitle}</p>
            </div>

            <div className="booking-card__body">
              {/* Personal Information Section */}
              <div className="booking-card__section">
                <h3 className="booking-card__section-title">
                  {language === 'en' ? 'Personal Information' : 'Thông tin cá nhân'}
                </h3>
                <div className="booking-card__section-content">
                  <label>
                    {copy.booking.fields.name}
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder={language === 'en' ? 'Enter your name' : 'Nhập tên của bạn'}
                    />
                  </label>

                  <label>
                    {copy.booking.fields.phone}
                    <div className="booking-card__phone-input">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => {
                          const value = event.target.value
                          
                          // Tự động detect mã quốc gia nếu số bắt đầu bằng +
                          if (value.startsWith('+')) {
                            const detectedCode = detectCountryCode(value)
                            if (detectedCode) {
                              // Cập nhật mã quốc gia nếu khác
                              if (detectedCode !== phoneCountryCode) {
                                setPhoneCountryCode(detectedCode)
                              }
                              // Tự động loại bỏ mã quốc gia khỏi số điện thoại nếu số đủ dài
                              // Chỉ tách khi số có ít nhất mã quốc gia + 3 số để tránh tách quá sớm
                              if (value.length >= detectedCode.length + 3) {
                                const numberWithoutCode = value.substring(detectedCode.length).trim()
                                // Chỉ tách nếu phần số không rỗng
                                if (numberWithoutCode) {
                                  setPhoneNumber(numberWithoutCode)
                                  return
                                }
                              }
                            }
                          }
                          setPhoneNumber(value)
                        }}
                        onBlur={(event) => {
                          // Khi blur, kiểm tra lại và tách mã quốc gia nếu cần
                          const value = event.target.value
                          if (value.startsWith('+')) {
                            const detectedCode = detectCountryCode(value)
                            if (detectedCode) {
                              setPhoneCountryCode(detectedCode)
                              const numberWithoutCode = value.substring(detectedCode.length).trim()
                              if (numberWithoutCode !== value) {
                                setPhoneNumber(numberWithoutCode)
                              }
                            }
                          }
                        }}
                        placeholder={language === 'en' ? 'Enter phone number (e.g., +84901234567 or 0901234567)' : 'Nhập số điện thoại (vd: +84901234567 hoặc 0901234567)'}
                        className="booking-card__phone-number"
                      />
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="booking-card__phone-code"
                        title={
                          COUNTRY_CODES.find((c) => c.code === phoneCountryCode)?.country ||
                          (language === 'en' ? 'Country code' : 'Mã quốc gia')
                        }
                      >
                        {COUNTRY_CODES.map((country) => (
                          <option key={`${country.code}-${country.country}`} value={country.code}>
                            {country.flag} {country.code} - {country.country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label>
                    {copy.booking.fields.city}
                    <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                      {CITY_OPTIONS.map((city) => (
                        <option key={city.value} value={city.value} disabled={city.disabled}>
                          {city.label[language]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="booking-card__section">
                <h3 className="booking-card__section-title">
                  {language === 'en' ? 'Event Details' : 'Chi tiết sự kiện'}
                </h3>
                <div className="booking-card__section-content">
                  <div className="booking-card__music-filter">
                    <label className="booking-card__music-label">{copy.booking.fields.music}</label>
                    <div className="booking-card__music-chips">
                      {MUSIC_FILTERS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={option.value === selectedMusic ? 'booking-chip booking-chip--active' : 'booking-chip'}
                          onClick={() => setSelectedMusic(option.value)}
                        >
                          {option.label[language]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="booking-card__row">
                    <label>
                      {copy.booking.fields.date}
                      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                    </label>

                    <label>
                      {copy.booking.fields.group}
                      <select value={groupSize} onChange={(event) => setGroupSize(Number(event.target.value))}>
                        {groupSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size} {size === 1 ? copy.booking.guestSingle : copy.booking.guestPlural}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {selectedMusic !== 'all' && filteredVenues.length > 0 && (
                    <div className="booking-card__bars">
                      <div className="booking-card__bars-header">
                        <label>{copy.booking.fields.bars} ({selectedBars.length}/3)</label>
                      </div>
                      <div className="booking-card__bars-cards">
                        {filteredVenues.map((venue) => (
                          <div
                            key={venue.id}
                            className={`booking-card__bar-card ${selectedBars.includes(venue.id) ? 'booking-card__bar-card--selected' : ''}`}
                            onClick={() => {
                              if (selectedBars.includes(venue.id)) {
                                setSelectedBars(selectedBars.filter((id) => id !== venue.id))
                              } else if (selectedBars.length < 3) {
                                setSelectedBars([...selectedBars, venue.id])
                              }
                            }}
                          >
                            <div className="booking-card__bar-card-image">
                              <img src={venue.image} alt={venue.name} loading="lazy" decoding="async" />
                              {selectedBars.includes(venue.id) && (
                                <div className="booking-card__bar-card-badge">
                                  ✓
                                </div>
                              )}
                            </div>
                            <div className="booking-card__bar-card-content">
                              <h4>{venue.name}</h4>
                              <p className="booking-card__bar-card-vibe">{venue.vibe}</p>
                              <div className="booking-card__bar-card-meta">
                                <span className="booking-card__bar-card-rating">★ {venue.rating}</span>
                                <span>{venue.neighborhood}</span>
                              </div>
                              <div className="booking-card__bar-card-tags">
                                {venue.genresDisplay?.slice(0, 2).map((genre) => (
                                  <span key={genre} className="booking-card__bar-card-tag">
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`booking-card__bar-card-btn ${selectedBars.includes(venue.id) ? 'booking-card__bar-card-btn--selected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (selectedBars.includes(venue.id)) {
                                  setSelectedBars(selectedBars.filter((id) => id !== venue.id))
                                } else if (selectedBars.length < 3) {
                                  setSelectedBars([...selectedBars, venue.id])
                                }
                              }}
                              disabled={selectedBars.length >= 3 && !selectedBars.includes(venue.id)}
                            >
                              {selectedBars.includes(venue.id)
                                ? language === 'en'
                                  ? 'Selected'
                                  : 'Đã chọn'
                                : language === 'en'
                                ? 'Select'
                                : 'Chọn'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="booking-card__section">
                <h3 className="booking-card__section-title">
                  {language === 'en' ? 'Your Itinerary' : 'Lịch trình của bạn'}
                </h3>
                <div className="booking-card__section-content">
                  <div className="booking-card__warmup">
                    <label className="booking-card__warmup-label">{copy.booking.fields.warmUp}</label>
                    <div className="booking-card__warmup-options">
                      {Object.entries(copy.booking.warmUpOptions).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className={warmUpVenue === key ? 'warmup-chip warmup-chip--active' : 'warmup-chip'}
                          onClick={() => setWarmUpVenue(warmUpVenue === key ? null : key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="booking-card__footer">
              <button
                className="primary"
                type="button"
                onClick={() => {
                  if (customerName.trim() && phoneNumber.trim()) {
                    // Send itinerary to WhatsApp behind the scenes
                    sendItineraryToWhatsApp()
                    // Show success page
                    setShowSuccess(true)
                  }
                }}
                disabled={!customerName.trim() || !phoneNumber.trim()}
              >
                {copy.booking.cta}
              </button>
              <small>{copy.booking.note}</small>
            </div>
          </div>
        </section>

        {/* Hidden to optimize performance - venue section */}
        {false && <section className="venue-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">{copy.citySection.eyebrow}</p>
              <h2>
                {copy.citySection.title} <span>{selectedCityLabel}</span>
              </h2>
            </div>
            <div className="chip-row">
              {MUSIC_FILTERS.slice(1, 7).map((tag) => (
                <button
                  key={tag.value}
                  className={tag.value === selectedMusic ? 'chip chip--active' : 'chip'}
                  onClick={() => setSelectedMusic(tag.value)}
                >
                  {tag.label[language]}
                </button>
              ))}
              <button
                className={selectedMusic === 'all' ? 'chip chip--active' : 'chip'}
                onClick={() => setSelectedMusic('all')}
              >
                {copy.chips.all}
              </button>
            </div>
          </div>

          <div className="venue-grid">
            {filteredVenues.map((venue) => (
              <article key={venue.id} className="venue-card">
                <div className="venue-image">
                  <img src={venue.image} alt={`${venue.name} venue`} loading="lazy" decoding="async" />
                  <span className="venue-badge">{venue.cityLabel ?? venue.city}</span>
                </div>

                <div className="venue-content">
                  <header>
                    <h3>{venue.name}</h3>
                    <p>{venue.vibe}</p>
                  </header>

                  <div className="venue-meta">
                    <span className="rating">
                      ★ {venue.rating}
                      <small>
                        ({venue.reviewCount} {copy.venue.reviews})
                      </small>
                    </span>
                    <span>{venue.neighborhood}</span>
                    <span>{venue.averageSpend}</span>
                  </div>

                  <p>{venue.description}</p>

                  <div className="tag-row">
                    {(venue.genresDisplay ?? venue.genres).map((genre) => (
                      <span key={genre} className="tag">
                        {genre}
                      </span>
                    ))}
                  </div>

                  <ul className="safety-list">
                    {venue.safetyHighlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <footer className="venue-footer">
                  <div className="slot-row">
                    {venue.upcomingSlots.map((slot) => (
                      <button
                        key={slot}
                        className={
                          selectedVenue?.id === venue.id && selectedSlot === slot ? 'slot active' : 'slot'
                        }
                        onClick={() => handleSlotSelect(venue.id, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <button
                    className="secondary"
                    onClick={() => handleSlotSelect(venue.id, venue.upcomingSlots[0])}
                  >
                    {copy.venue.planSafe}
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>}

        {/* Hidden to optimize performance - nightclub gallery */}
        {false && <section className="nightclub-gallery">
          <div className="nightclub-gallery__header">
            <div>
              <p className="eyebrow">{copy.gallery.eyebrow}</p>
              <h2>{copy.gallery.title}</h2>
              <p className="nightclub-gallery__lead">{copy.gallery.body}</p>
            </div>
          </div>

          <div className="nightclub-gallery__body">
            <div className="nightclub-gallery__list">
              {nightclubs.length === 0 ? (
                <div className="nightclub-gallery__list-empty">
                  {isNightclubLoading ? copy.gallery.loading : copy.gallery.empty}
                </div>
              ) : (
                nightclubs.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    className={
                      club.id === selectedNightclubId
                        ? 'nightclub-gallery__club nightclub-gallery__club--active'
                        : 'nightclub-gallery__club'
                    }
                    onClick={() => handleNightclubSelect(club.id)}
                  >
                    <span>{club.name}</span>
                    <small>
                      {club.images.length} {copy.gallery.imageCountSuffix}
                    </small>
                  </button>
                ))
              )}
            </div>

            <div className="nightclub-gallery__slider">
              {isNightclubLoading ? (
                <div className="nightclub-gallery__placeholder">{copy.gallery.loading}</div>
              ) : nightclubError ? (
                <div className="nightclub-gallery__placeholder nightclub-gallery__placeholder--error">
                  {copy.gallery.error}
                </div>
              ) : !selectedNightclub || activeNightclubTotal === 0 || !activeNightclubImageSrc ? (
                <div className="nightclub-gallery__placeholder">{copy.gallery.empty}</div>
              ) : (
                <>
                  <div className="nightclub-gallery__frame">
                    <img
                      src={activeNightclubImageSrc}
                      alt={`${selectedNightclub.name} ${copy.gallery.photoLabel} ${activeNightclubSlide + 1}`}
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                  </div>
                  <div className="nightclub-gallery__controls">
                    <button
                      type="button"
                      className="nightclub-gallery__nav"
                      onClick={handleNightclubPrev}
                      aria-label={copy.gallery.controls.prev}
                    >
                      ‹
                    </button>
                    <span className="nightclub-gallery__counter">
                      {copy.gallery.photoLabel} {activeNightclubSlide + 1} {copy.gallery.ofLabel}{' '}
                      {activeNightclubTotal}
                    </span>
                    <button
                      type="button"
                      className="nightclub-gallery__nav"
                      onClick={handleNightclubNext}
                      aria-label={copy.gallery.controls.next}
                    >
                      ›
                    </button>
                  </div>
                  <div className="nightclub-gallery__thumbs">
                    {activeNightclubImages.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        className={
                          index === activeNightclubSlide
                            ? 'nightclub-gallery__thumb nightclub-gallery__thumb--active'
                            : 'nightclub-gallery__thumb'
                        }
                        onClick={() => handleNightclubThumbSelect(index)}
                        aria-label={`${selectedNightclub.name} ${copy.gallery.photoLabel} ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${selectedNightclub.name} thumbnail ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>}

        {/* Hidden to optimize performance - safety section */}
        {false && <section className="safety-section">
          <div>
            <p className="eyebrow">{copy.safety.eyebrow}</p>
            <h2>{copy.safety.title}</h2>
          </div>

          <div className="safety-grid">
            {copy.safety.items.map((item) => (
              <div key={item.title} className="safety-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>}
          </>
        )}

        {currentPage === 'bars-clubs' && <BarsClubsPage />}
        {currentPage === 'restaurants' && <RestaurantsPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-page">
            <div className="success-page__header">
              <div className="success-page__icon">✓</div>
              <h2>{copy.success.title}</h2>
              <p className="success-page__subtitle">{copy.success.subtitle}</p>
            </div>

            <div className="success-page__body">
              <div className="success-page__message-card">
                <p className="success-page__message">{copy.success.message}</p>
              </div>

              <div className="success-page__summary">
                <div className="success-page__summary-card">
                  <div className="success-page__summary-icon">👤</div>
                  <div className="success-page__summary-content">
                    <div className="success-page__summary-label">{copy.booking.fields.name}</div>
                    <div className="success-page__summary-value">{customerName}</div>
                  </div>
                </div>

                <div className="success-page__summary-card">
                  <div className="success-page__summary-icon">📞</div>
                  <div className="success-page__summary-content">
                    <div className="success-page__summary-label">{copy.booking.fields.phone}</div>
                    <div className="success-page__summary-value">{phoneCountryCode} {phoneNumber}</div>
                  </div>
                </div>

                <div className="success-page__summary-card">
                  <div className="success-page__summary-icon">📅</div>
                  <div className="success-page__summary-content">
                    <div className="success-page__summary-label">{copy.booking.fields.date}</div>
                    <div className="success-page__summary-value">
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className="success-page__summary-card">
                  <div className="success-page__summary-icon">👥</div>
                  <div className="success-page__summary-content">
                    <div className="success-page__summary-label">{copy.booking.fields.group}</div>
                    <div className="success-page__summary-value">
                      {groupSize} {groupSize === 1 ? copy.booking.guestSingle : copy.booking.guestPlural}
                    </div>
                  </div>
                </div>

                {warmUpVenue && (
                  <div className="success-page__summary-card">
                    <div className="success-page__summary-icon">🍺</div>
                    <div className="success-page__summary-content">
                      <div className="success-page__summary-label">{copy.booking.fields.warmUp}</div>
                      <div className="success-page__summary-value">{copy.booking.warmUpOptions[warmUpVenue]}</div>
                    </div>
                  </div>
                )}

                {selectedBars.length > 0 && (
                  <div className="success-page__summary-card success-page__summary-card--bars">
                    <div className="success-page__summary-icon">🎵</div>
                    <div className="success-page__summary-content">
                      <div className="success-page__summary-label">{copy.booking.fields.bars}</div>
                      <div className="success-page__summary-value">
                        {selectedBars
                          .filter((id) => id)
                          .map((id) => {
                            const venue = allVenues.find((v) => v.id === id)
                            return venue?.name
                          })
                          .filter(Boolean)
                          .map((name, index, arr) => (
                            <span key={index}>
                              {name}
                              {index < arr.length - 1 && <span className="success-page__bar-separator"> • </span>}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="success-page__footer">
              <button className="primary success-page__cta" onClick={() => setShowSuccess(false)}>
                {copy.success.backToHome}
              </button>
              <a
                href="https://wa.me/84978270038"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary success-page__contact"
              >
                {copy.success.contact}
              </a>
            </div>
          </div>
        </div>
      )}

      {selectedSlot && (
        <aside className="booking-drawer">
          <div className="drawer-header">
            <div>
              <p className="eyebrow">{copy.drawer.eyebrow}</p>
              <h2>{selectedVenue?.name}</h2>
              <span>{selectedVenue?.cityLabel ?? selectedVenue?.city}</span>
            </div>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setSelectedSlot(null)}
              aria-label="Close booking drawer"
            >
              ×
            </button>
          </div>

          <div className="drawer-body">
            <div className="drawer-info">
              <strong>{copy.drawer.slotLabel}</strong>
              <span>{selectedSlot}</span>
            </div>

            <div className="drawer-info">
              <strong>{copy.drawer.dateLabel}</strong>
              <span>
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="drawer-info">
              <strong>{copy.drawer.groupLabel}</strong>
              <span>
                {groupSize} {groupSize === 1 ? copy.booking.guestSingle : copy.booking.guestPlural}
              </span>
            </div>

            <div className="drawer-info">
              <strong>{copy.drawer.languagesLabel}</strong>
              <span>{selectedVenue?.languages.join(' • ')}</span>
            </div>

            <div className="drawer-notice">
              {copy.drawer.notice.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <button className="primary drawer-action">
            {copy.drawer.ctaConfirm}
          </button>
        </aside>
      )}

      <footer className="site-footer">
        <div>
          <div className="footer-brand">
            <img 
              src="/logo-circle-250kb.jpg" 
              alt="Nightlife Atlas" 
              className="footer-logo"
            />
            <div>
              <strong>Nightlife Atlas</strong>
              <p>{copy.footer.tagline}</p>
            </div>
          </div>
        </div>
        <div className="footer-links">
          {copy.footer.links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer-meta">
          <span>{copy.footer.metaLine1}</span>
          <span>{copy.footer.emergency}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
