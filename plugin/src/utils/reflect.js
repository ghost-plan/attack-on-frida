/**
 * long description for the file
 *
 * @summary short description for the file
 * @author jamesfchen
 *
 * Created at     : 2021-02-07 16:18:25
 * Last modified  : 2021-02-07 17:44:51
 */

function getFieldValue(object, fieldName) {
  var field = object.class.getDeclaredField(fieldName);
  field.setAccessible(true);
  var fieldValue = field.get(object);
  if (null == fieldValue) {
    return null;
  }
  var FieldClazz = Java.use(fieldValue.$className);
  var fieldValueWapper = Java.cast(fieldValue, FieldClazz);
  return fieldValueWapper;
}
function setFieldValue(object, fieldName, fieldValue) {
  var field = object.class.getDeclaredField(fieldName);
  field.setAccessible(true);
  field.set(object, fieldValue);
}
var reflect_method = [
  "FindClass",
  "DefineClass",
  //method start
  "GetMethodID",
  "GetStaticMethodID",

  "CallVoidMethod",
  "CallStaticVoidMethod",
  // 'CallNonvirtualVoidMethod',
  "CallObjectMethod",
  "CallStaticObjectMethod",
  // 'CallNonvirtualObjectMethod',
  "CallBooleanMethod",
  "CallStaticBooleanMethod",
  // 'CallNonvirtualBooleanMethod',
  "CallByteMethod",
  "CallStaticByteMethod",
  // 'CallNonvirtualByteMethod',
  "CallCharMethod",
  "CallStaticCharMethod",
  // 'CallNonvirtualCharMethod',
  "CallShortMethod",
  "CallStaticShortMethod",
  // 'CallNonvirtualShortMethod',
  "CallIntMethod",
  "CallStaticIntMethod",
  // 'CallNonvirtualIntMethod',
  "CallLongMethod",
  "CallStaticLongMethod",
  // 'CallNonvirtualLongMethod',
  "CallFloatMethod",
  "CallStaticFloatMethod",
  // 'CallNonvirtualFloatMethod',
  "CallDoubleMethod",
  "CallStaticDoubleMethod",
  // 'CallNonvirtualDoubleMethod',

  //method end
  "RegisterNatives",

  //field start
  "GetFieldID",
  "GetStaticFieldID",
  "GetObjectField",
  "GetStaticObjectField",
  "GetBooleanField",
  "GetStaticBooleanField",
  "GetByteField",
  "GetStaticByteField",
  "GetCharField",
  "GetStaticCharField",
  "GetShortField",
  "GetStaticShortField",
  "GetIntField",
  "GetStaticIntField",
  "GetLongField",
  "GetStaticLongField",
  "GetFloatField",
  "GetStaticFloatField",
  "GetDoubleField",
  "GetStaticDoubleField",

  "SetObjectField",
  "SetStaticObjectField",
  "SetDoubleField",
  "SetFloatField",
  "SetLongField",
  "SetIntField",
  "SetShortField",
  "SetCharField",
  "SetByteField",
  "SetBooleanField",

  "GetStringUTFChars",
  "NewStringUTF",
  "GetArrayLength",
  "NewObjectArray",
  "GetByteArrayElements",
  "GetCharArrayElements",
  //field end
];
