export class StringUtils {
  public static format(stringToFormat: string, ...stringValues: string[]): string {
    let formattedString = stringToFormat;

    for (let valueIndex = 0; valueIndex < stringValues.length; valueIndex++) {
      formattedString = formattedString.replace(`{${valueIndex}}`, stringValues[valueIndex]);
    }

    return formattedString;
  }
}
