import type {
  DeepKeys,
  DeepValue,
  FieldAsyncValidateOrFn,
  FieldValidateOrFn,
  FieldValidators,
} from '@tanstack/form-core'
import type { Component, VNode } from 'vue'
import type { z } from 'zod'

type FieldData<
  TValues extends Record<string, unknown>,
  TName extends DeepKeys<TValues>,
> = DeepValue<TValues, TName>

type FieldSyncFn<
  TValues extends Record<string, unknown>,
  TName extends DeepKeys<TValues>,
> = FieldValidateOrFn<TValues, TName, FieldData<TValues, TName>>

type FieldAsyncFn<
  TValues extends Record<string, unknown>,
  TName extends DeepKeys<TValues>,
> = FieldAsyncValidateOrFn<TValues, TName, FieldData<TValues, TName>>

/**
 * Per-field config for {@link UIForm}.
 * Validator generics use `Fn | undefined` (not `undefined` alone) so optional slots like
 * `onChangeAsync` accept real validators.
 */
export type SchemaFieldConfig<
  TValues extends Record<string, unknown> = Record<string, unknown>,
  TName extends DeepKeys<TValues> = DeepKeys<TValues>,
> = {
  as: Component
  props?: Record<string, unknown>
  slots?: Record<string, () => VNode | string>
  /** Prepended to the field value on submit (e.g. `https://`) */
  prefix?: string
  /** Appended to the field value on submit (e.g. `.com`) */
  suffix?: string
  validators?: FieldValidators<
    TValues,
    TName,
    FieldData<TValues, TName>,
    FieldSyncFn<TValues, TName> | undefined,
    FieldSyncFn<TValues, TName> | undefined,
    FieldAsyncFn<TValues, TName> | undefined,
    FieldSyncFn<TValues, TName> | undefined,
    FieldAsyncFn<TValues, TName> | undefined,
    FieldSyncFn<TValues, TName> | undefined,
    FieldAsyncFn<TValues, TName> | undefined,
    FieldSyncFn<TValues, TName> | undefined,
    FieldAsyncFn<TValues, TName> | undefined
  >
}

export type SchemaFieldsMap<TValues extends Record<string, unknown>> = {
  [K in keyof TValues & string]: SchemaFieldConfig<TValues, K>
}

export type SchemaFormLayout<TKey extends string = string> = TKey | readonly TKey[] | TKey[]

export function layoutRowKeys(row: SchemaFormLayout<string>): string[] {
  if (typeof row === 'string') {
    return [row]
  }
  return [...row]
}

export type InferSchemaValues<TSchema extends z.ZodType> =
  z.infer<TSchema> extends infer V
    ? V extends Record<string, unknown>
      ? V
      : Record<string, unknown>
    : Record<string, unknown>
