export const ROLE_ADMIN = 1;
export const ROLE_TEACHER = 2;
export const ROLE_STUDENT = 3;
export const MODEL_FETCH_COUNT_ALL = 10 * 1000;

export const TYPE_COURSE = 1;
export const TYPE_PRACTICE_TEST = 2;

export const SECTION_ITEM_LECTURE = 1;
export const SECTION_ITEM_QUIZ = 2;
export const SECTION_ITEM_ASSIGNMENT = 3;

export const FILE_TYPE_AVATAR = 1;
export const FILE_TYPE_THUMBNAIL = 2;
export const FILE_TYPE_VIDEO = 3;
export const FILE_TYPE_DOCUMENT = 4;
export const FILE_TYPE_ASSIGNMENT = 5;
export const FILE_TYPE_SUBTITLE = 6;

export const COURSE_STATUS_DRAFT = 1;
export const COURSE_STATUS_IN_REVIEW = 2;
export const COURSE_STATUS_PUBLISHED = 3;

export const QUESTION_TYPE_TRUE_FALSE = 1;
export const QUESTION_TYPE_MCQ = 2;

export const ASSIGNMENT_DRAFT = 1;
export const ASSIGNMENT_SUBMITTED = 2;

export const COURSE_FORM_AUTO_UPDATE_DELAY = 1500; // ms
export const NAVBAR_WIDTH = {
  lg: 300,
  md: 200,
};
export const PANEL_HEADER_HIGHT = 80;
export const PANEL_PAGE_HEADER_HIGHT = 90;
export const PAGE_HEADER_HEIGHT = 65;

export const TOKEN_EXPIRED_ERROR_NAME = 'tokenExpired';
export const UNAUTHORIZED_ERROR_NAME = 'Unauthorized';

export const DEFAULT_REDIRECT_PATH = {
  [ROLE_TEACHER]: '/console/teacher/profile/basic-info',
  [ROLE_STUDENT]: '/console/student/my-courses/learning',
  [ROLE_ADMIN]: '/console/admin/dashboard',
};
export const CURRENCY_NAME = 'JPY';

export const PAYPAL_CID = process.env.NEXT_PUBLIC_PAYPAL_CID || '';

export const ROLES = {
  [ROLE_ADMIN]: 'Admin',
  [ROLE_TEACHER]: 'Teacher',
  [ROLE_STUDENT]: 'Student',
};

export const COURSE_STATUS = {
  [COURSE_STATUS_DRAFT]: 'Draft',
  [COURSE_STATUS_IN_REVIEW]: 'In Review',
  [COURSE_STATUS_PUBLISHED]: 'Published',
};

export const TIMER_MIN_KEY = 'opt-timer-min';
export const TIMER_SEC_KEY = 'opt-timer-sec';

export const TITLE_MAX_CHAR = 80;
export const EXPLAIN_MAX_CHAR = 600;

export const CART_ITEMS_LOCAL_STORAGE_KEY = 'cart-items';

export const PROTECTED_ROUTES = [
  {
    exact: false,
    path: '/course/[slug]/[eId]/[itemType]/[itemId]/[tabId]',
  },
  {
    exact: false,
    path: '/console',
  },
];
