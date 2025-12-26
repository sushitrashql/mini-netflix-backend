import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEpisodioDto } from './create-episodio.dto';

export class UpdateEpisodioDto extends PartialType(
  OmitType(CreateEpisodioDto, ['idSerie'] as const),
) {}