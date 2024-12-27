import * as React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';

// ジェネリック型 T を使って、フォームの型に応じたフィールドを柔軟にサポート
interface OneTimePasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>; // 親から明示的に "oneTimePassword" を渡すようにする
}

function OneTimePasswordField<T extends FieldValues>({
  control,
  name,
}: OneTimePasswordFieldProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-600">ワンタイムパスワード</FormLabel>
          <FormControl>
            <input
              type="text"
              placeholder="123456"
              className="w-full p-2 border rounded-md text-base"
              maxLength={6} // ワンタイムパスワードが6桁であることを想定
              inputMode="numeric" // モバイルで数字キーボードを表示
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default OneTimePasswordField;
