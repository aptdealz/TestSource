export const defaultImages = {
  banner: 'assets/images/cover.png',
  userProfile: 'assets/images/profile.png',
};

export async function runImage(url: string) {
  let result = '';
  try {
    result = await testImage(url);
  } catch (error: any) {
    result = error;
  }
  return { result, url };
}

// https://stackoverflow.com/a/9714891/17447
function testImage(url: string, timeout = 5000): Promise<string> {
  return new Promise(function (resolve, reject) {
    let timer: any;
    const img = new Image();
    img.onerror = img.onabort = function () {
      clearTimeout(timer);
      reject('error');
    };
    img.onload = function () {
      clearTimeout(timer);
      resolve('success');
    };
    timer = setTimeout(function () {
      // reset .src to invalid URL so it stops previous
      // loading, but doens't trigger new load
      img.src = '//!!!!/noexist.jpg';
      reject('timeout');
    }, timeout);
    img.src = url;
  });
}
