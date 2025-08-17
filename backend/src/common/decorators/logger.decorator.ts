import { SetMetadata } from '@nestjs/common';

export const LogInfoOptionMetadata = 'LogInfoOption';

export const LogInfo = () => SetMetadata(LogInfoOptionMetadata, true);
