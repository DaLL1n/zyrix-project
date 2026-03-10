// Переиспользуем Intl.NumberFormat, потому что создавать его на каждый вызов затратно.
const formatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Возвращает экземпляр Intl.NumberFormat из кэша для конкретного набора параметров.
 * Если formatter для таких настроек ещё не создан, он будет создан и сохранён в кэше.
 *
 * @param currency Код валюты, например USD.
 * @param minimumFractionDigits Минимальное количество знаков после запятой.
 * @param maximumFractionDigits Максимальное количество знаков после запятой.
 * @returns Кэшированный formatter для форматирования денежных значений.
 */
const getFormatter = (
  currency: string,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
) => {
  const key = [
    'en-US',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  ].join(':');

  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });

    formatterCache.set(key, formatter);
  }

  return formatter;
};

/**
 * Форматирует число как валюту с переиспользованием кэшированного formatter.
 * Для значений меньше 100 принудительно убирает минимальное количество знаков после запятой.
 *
 * @param value Числовое значение для форматирования.
 * @param currency Код валюты, по умолчанию USD.
 * @param minimumFractionDigits Минимальное количество знаков после запятой.
 * @param maximumFractionDigits Максимальное количество знаков после запятой.
 * @returns Отформатированная строка валюты.
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 1,
  maximumFractionDigits: number = 3,
): string => {
  const normalizedMinimumFractionDigits =
    value < 100 ? 0 : minimumFractionDigits;

  return getFormatter(
    currency,
    normalizedMinimumFractionDigits,
    maximumFractionDigits,
  ).format(value);
};
