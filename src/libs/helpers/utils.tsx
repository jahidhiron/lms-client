import { UseFormReturnType } from '@mantine/form';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { CourseModel } from '~/features/course/course.model';
import { COURSE_FORM_AUTO_UPDATE_DELAY, PROTECTED_ROUTES } from './constants';
import { courseNavigation } from './route.map';
import { ErrorResponseType } from './shared-model';

export const domainParser = (req: any) => {
  let domain = req.headers.get('host') as string;

  domain = domain.replace('www.', ''); // remove www. from domain

  const path = req.nextUrl.pathname;

  return { domain, path };
};

export const getStaticContentUrl = (path: string) => {
  try {
    new URL(path);
    return path;
  } catch {
    return `${process.env.NEXT_PUBLIC_STATIC_CONTENT_BASEURL}/${path}`;
  }
};

export const getUrl = (path: string) => {
  try {
    new URL(path);
    return path;
  } catch {
    return `${process.env.NODE_ENV == 'development' ? 'http://' : 'https://'}${
      process.env.NEXT_PUBLIC_SITE_ORIGIN
    }/${path}`;
  }
};

export const errorResolver =
  (form?: UseFormReturnType<any, any>) =>
  (err: AxiosError<ErrorResponseType>) => {
    if (form) {
      const fieldErrors = Object.keys(err?.response?.data || {});
      if (fieldErrors.length > 0 && !fieldErrors?.includes('correlationId')) {
        fieldErrors.forEach((key) => {
          form.setFieldError(
            key,
            (err?.response?.data as Record<string, string>)[key]
          );
        });
      }
    }
    // console.log('Failed: Error: ', err);

    return err?.response?.data?.message ?? err?.message ?? 'something wrong';
  };

export const dateFormatter = (date: string) =>
  dayjs(date).format('DD-MMM-YYYY');

export const currencyFormatter = (amount: number, currency: string = 'JPY') => {
  try {
    return Intl.NumberFormat('jp-JP', { style: 'currency', currency }).format(
      amount
    );
  } catch {
    return Intl.NumberFormat('jp-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  }
};

export const pluralizationFormat = (
  count: number,
  singular: string,
  plural: string
) => {
  const map = new Map([
    ['one', singular],
    ['other', plural],
  ]);
  const pr = new Intl.PluralRules('en-US');
  return map.get(pr.select(count));
};

export const numberFormat = (num: number, minimumIntegerDigits?: number) =>
  Intl.NumberFormat('jp-JP', {
    compactDisplay: 'long',
    minimumIntegerDigits: minimumIntegerDigits ?? 2,
  }).format(num);

function capitalizeString(inputString: string) {
  // Check if the inputString is not empty
  if (inputString.length === 0) {
    return inputString;
  }

  // Capitalize the first letter and concatenate the rest of the string
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export function joiResolver(schema: any, options?: any) {
  const _schema = schema;
  return (values: any) => {
    const parsed = _schema.validate(
      values,
      Object.assign({ abortEarly: false }, options)
    );
    if (!parsed.error) {
      return {};
    }
    const results: Record<string, string> = {};
    parsed.error.details.forEach((error: any) => {
      const path = error.path.join('.');
      const message = error.message.replace(
        /"([^"]+)"/g,
        capitalizeString(error?.context?.key)
      ); // Remove double quotes

      results[path] = message;
    });
    return results;
  };
}

export function zodResolver(schema: any) {
  return (values: any) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      return {};
    }
    // console.log(parsed.error.errors);
    const results = {};
    parsed.error.errors.forEach((error: any) => {
      // @ts-ignore
      results[error.path.join('.')] = error.message;
    });
    return results;
  };
}

export function getCourseCompletePercentage(course: CourseModel) {
  const routes = courseNavigation(() => '', course);
  const totalLength = routes.flatMap((f) => f.children).length;
  const totalDone = routes
    .flatMap((f) => f.children)
    .filter((r) => r?.done == true).length;

  return (totalDone * 100) / totalLength;
}

export function autoUpdateTrigger(
  form: any,
  delay: number = COURSE_FORM_AUTO_UPDATE_DELAY
) {
  setTimeout(() => {
    // @ts-ignore
    form?.submitBtnRef?.click?.();
  }, delay);
}

export function formatTimeFromSeconds(totalSeconds: number) {
  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = (remainingSeconds % 60).toFixed(0);

  // Format the time as "hh:mm:ss"
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (formattedHours == '00') {
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function unitFormatter(byte: number) {
  const byteValueNumberFormatter = Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'unit',
    unit: 'byte',
    unitDisplay: 'narrow',
  });
  return byteValueNumberFormatter.format(byte);
}

export function nanoNumber() {
  return parseInt(`${Math.random() * 100000000}`);
}

export function isEmptyObject(obj: any) {
  return typeof obj == 'object' && Object.keys(obj).length === 0;
}

export function secondToText(seconds: number, longLevel?: boolean): string {
  if (seconds < 0) {
    return 'Invalid input: Please provide a non-negative number of seconds.';
  }

  const hours = Math.floor(seconds / 3600);
  const hoursLevel = longLevel
    ? pluralizationFormat(hours, 'hour', 'hours')
    : 'h';
  const minutes = Math.floor((seconds % 3600) / 60);
  const minutesLevel = longLevel
    ? pluralizationFormat(minutes, 'minute', 'minutes')
    : 'm';
  const remainingSeconds = Math.floor(seconds % 60);
  const remainingSecondsLevels = longLevel
    ? pluralizationFormat(remainingSeconds, 'second', 'seconds')
    : 's';

  const hoursText = hours > 0 ? `${hours}${hoursLevel} ` : '';
  const minutesText = minutes > 0 ? `${minutes}${minutesLevel} ` : '';
  const secondsText =
    remainingSeconds > 0 ? `${remainingSeconds}${remainingSecondsLevels}` : '';

  if (hours === 0 && minutes === 0 && remainingSeconds === 0) {
    return '0' + remainingSecondsLevels;
  }

  return `${hoursText}${minutesText}${secondsText}`;
}

export function generateRoutePattern(routePattern: string) {
  // Escape special characters in the route pattern
  const escapedPattern = routePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Replace '*' with a pattern matching any characters (.*)
  const regexPattern = escapedPattern.replace(/\*/g, '.*');

  return new RegExp(`^${regexPattern}$`);
}

export function convertToHumanReadable(dateString: string) {
  const inputDate = dayjs(dateString);
  const currentDate = dayjs();
  const timeDifference = currentDate.diff(inputDate);

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } else if (days >= 1) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just Now';
  }
}

export function isProtectedRoute(routePathname: string) {
  return PROTECTED_ROUTES.some((exp) => {
    if (exp.exact) {
      return exp.path == routePathname;
    } else {
      return routePathname.includes(exp.path);
    }
  });
}
