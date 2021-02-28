const ARTICLES = [
  { id: 1, article: '123451', name: 'Hockey skates, size 8', description: '123451 (Hockey skates, size 8)', price: 24000 },
  { id: 2, article: '123452', name: 'Hockey skates, size 9', description: '123452 (Hockey skates, size 9)', price: 24500 },
  { id: 3, article: '123453', name: 'Hockey skates, size 10', description: '123453 (Hockey skates, size 10)', price: 25000 },
  { id: 4, article: '232451', name: 'Hockey stick, right, 160cm', description: '232451 (Hockey stick, right, 160cm)', price: 5050 },
  { id: 5, article: '232452', name: 'Hockey stick, right, 170cm', description: '232452 (Hockey stick, right, 170cm)', price: 5250 },
  { id: 6, article: '232453', name: 'Hockey stick, left, 160cm', description: '232453 (Hockey stick, left, 160cm)', price: 5150 },
  { id: 7, article: '232454', name: 'Hockey stick, left, 170cm', description: '232454 (Hockey stick, left, 170cm)', price: 5350 },
  { id: 8, article: '321431', name: 'Puck, plastic', description: '321431 (Puck, plastic)', price: 1200 },
  { id: 9, article: '321432', name: 'Puck, rubber', description: '321432 (Puck, rubber)', price: 3100 },
  { id: 10, article: '1122331', name: 'Hockey Helmet, size 58', description: '1122331 (Hockey Helmet, size 58)', price: 5799 },
  { id: 11, article: '1122332', name: 'Hockey Helmet, size 59', description: '1122332 (Hockey Helmet, size 59)', price: 5899 },
  { id: 12, article: '1122333', name: 'Ski Helmet, size 58', description: '1122333 (Ski Helmet, size 58)', price: 4790 },
  { id: 13, article: '1122334', name: 'Ski Helmet, size 59', description: '1122334 (Ski Helmet, size 59)', price: 4990 },
  { id: 14, article: '1122335', name: 'Ski Helmet, size 60', description: '1122335 (Ski Helmet, size 60)', price: 5200 },
  { id: 15, article: '2221431', name: 'Skis, Fischer, plastic, 160cm', description: '2221431 (Skis, Fischer, plastic, 160cm)', price: 23100 },
  { id: 16, article: '2221432', name: 'Skis, Fischer, plastic, 165cm', description: '2221432 (Skis, Fischer, plastic, 165cm)', price: 24100 },
  { id: 17, article: '2221433', name: 'Skis, Fischer, plastic, 170cm', description: '2221433 (Skis, Fischer, plastic, 170cm)', price: 25100 },
  { id: 18, article: '2221434', name: 'Skis, Atomic, plastic, 160cm', description: '2221434 (Skis, Atomic, plastic, 160cm)', price: 26100 },
  { id: 19, article: '2221435', name: 'Skis, Atomic, plastic, 165cm', description: '2221435 (Skis, Atomic, plastic, 165cm)', price: 27100 },
  { id: 20, article: '2221436', name: 'Skis, Atomic, plastic, 170cm', description: '2221436 (Skis, Atomic, plastic, 170cm)', price: 27500 },
  { id: 21, article: '2221437', name: 'Skis, Atomic, plastic, 175cm', description: '2221437 (Skis, Atomic, plastic, 175cm)', price: 27700 },
  { id: 22, article: '2221438', name: 'Skis, Atomic, plastic, 180cm', description: '2221438 (Skis, Atomic, plastic, 180cm)', price: 28000 },
  { id: 23, article: '336431', name: 'Skis, wooden wide, 150cm', description: '336431 (Skis, wooden wide, 150cm)', price: 9990 },
  { id: 24, article: '336432', name: 'Skis, wooden narrow, 150cm', description: '336432 (Skis, wooden narrow, 150cm)', price: 9990 },
  { id: 25, article: '336433', name: 'Skis, wooden narrow, Tourist, 165cm', description: '336433 (Skis, wooden narrow, Tourist, 165cm)', price: 10999 },
  { id: 26, article: '336434', name: 'Skis, plastic narrow, Tourist, 165cm', description: '336434 (Skis, plastic narrow, Tourist, 165cm)', price: 12999 },
  { id: 27, article: '472131', name: 'Ski poles, Fischer, plastic, 175cm', description: '472131 (Ski poles, Fischer, plastic, 175cm)', price: 6200 },
  { id: 28, article: '472132', name: 'Ski poles, Fischer, plastic, 180cm', description: '472132 (Ski poles, Fischer, plastic, 180cm)', price: 6400 },
  { id: 29, article: '472133', name: 'Ski poles, Fischer, plastic, 185cm', description: '472133 (Ski poles, Fischer, plastic, 185cm)', price: 6600 },
  { id: 30, article: '472134', name: 'Ski poles, Rossignol, plastic, 175cm', description: '472134 (Ski poles, Rossignol, plastic, 175cm)', price: 7200 },
  { id: 31, article: '472135', name: 'Ski poles, Rossignol, plastic, 180cm', description: '472135 (Ski poles, Rossignol, plastic, 180cm)', price: 7400 },
  { id: 32, article: '472136', name: 'Ski poles, Rossignol, plastic, 185cm', description: '472136 (Ski poles, Rossignol, plastic, 185cm)', price: 7600 },
  { id: 33, article: '472137', name: 'Ski poles, Rossignol, plastic, 190cm', description: '472137 (Ski poles, Rossignol, plastic, 190cm)', price: 7800 },
  { id: 34, article: '551298', name: 'Sleigh, wooden', description: '551298 (Sleigh, wooden)', price: 4500 },
  { id: 35, article: '6375431', name: 'Snowboard, 160cm', description: '6375431 (Snowboard, 160cm)', price: 9100 },
  { id: 36, article: '6375432', name: 'Snowboard, 150cm', description: '6375432 (Snowboard, 150cm)', price: 9900 },
  { id: 37, article: '7756121', name: 'Alpine skis, Atomic, 140cm', description: '7756121 (Alpine skis, Atomic, 140cm)', price: 12300 },
  { id: 38, article: '7756122', name: 'Alpine skis, Atomic, 145cm', description: '7756122 (Alpine skis, Atomic, 145cm)', price: 13300 },
  { id: 39, article: '7756123', name: 'Alpine skis, HEAD, 140cm', description: '7756123 (Alpine skis, HEAD, 140cm)', price: 13100 },
  { id: 40, article: '7756124', name: 'Alpine skis, HEAD, 145cm', description: '7756124 (Alpine skis, HEAD, 145cm)', price: 14100 },
  { id: 41, article: '888231', name: 'Junior alpine skis, Atomic', description: '888231 (Junior alpine skis, Atomic)', price: 5500 },
  { id: 42, article: '888232', name: 'Junior alpine skis, HEAD', description: '888232 (Junior alpine skis, HEAD)', price: 6500 },
];

export { ARTICLES };
