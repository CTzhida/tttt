function isAnagram (str1, str2) {
  if(str1.length !== str2.length) {
    return false
  }
  // 生成大小写字母键值对 { 97: {count1: 0, count2: 0} ... }
  const hash = {}
  // O(52)
  for(let i = 'a'.charCodeAt(); i <= 'z'.charCodeAt(); i++) {
     hash[i] = {count1: 0, count2: 0}
  }
  for(let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); i++) {
    hash[i] = {count1: 0, count2: 0}
  }
  
  // 遍历两个字符串，并统计出现数量
  // O(n)
  for(let i = 0; i < str1.length; i++) {
      hash[str1[i].charCodeAt()]['count1'] += 1
      hash[str2[i].charCodeAt()]['count2'] += 1
  }
  // 判断hash内count1、count2是否相同
  // O(52)
  let flag = true;
  for(let key in hash) {
    if (hash[key].count1 !== hash[key].count2) {
      flag = false
      break
    }
  }
  return flag
}

const str1 = 'testest'
const str2 = 'eessttt'
const str3 = 'asdfghjkl'
const str4 = 'lkjhgfdsa'
const str5 = 'aiiopxADpasj'
const str6 = 'aiiopxadpasj'

// 时间复杂度O(n + 52 + 52) = O(n)
console.log(isAnagram(str1, str2))
console.log(isAnagram(str3, str4))
console.log(isAnagram(str5, str6))



