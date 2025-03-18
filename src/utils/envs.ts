export const getEnv = (name: string): string => {
  const envValue = process.env[name];
  console.log(`gevEnv: ${name} => ${envValue}`);
  if (!envValue) throw new Error('env variable not found');
  return envValue;
};
