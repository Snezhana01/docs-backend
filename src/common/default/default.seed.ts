import { Seeder } from '@jorgebodega/typeorm-seeding';
import type {
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import type { DefaultEntity } from './default.entity';

// eslint-disable-next-line import/no-default-export
export default abstract class DefaultSeeds extends Seeder {
  abstract run(dataSource: DataSource): Promise<void>;

  async createNotExistsEntities<TEntity extends DefaultEntity>(
    repository: Repository<TEntity>,
    seeds: Array<DeepPartial<TEntity>>,
    entityConditionAlreadyExists: (
      seed: DeepPartial<TEntity>,
    ) => Array<FindOptionsWhere<TEntity>> | FindOptionsWhere<TEntity>,
  ) {
    const foundSeeds = await this.findCreated(
      repository,
      seeds,
      entityConditionAlreadyExists,
    );
    const newSeeds = this.getNewSeeds(seeds, foundSeeds);

    return this.saveSeeds(repository, newSeeds);
  }

  private async findCreated<TEntity extends DefaultEntity>(
    repository: Repository<TEntity>,
    seeds: Array<DeepPartial<TEntity>>,
    entityConditionAlreadyExists: (
      seed: DeepPartial<TEntity>,
    ) => Array<FindOptionsWhere<TEntity>> | FindOptionsWhere<TEntity>,
  ): Promise<Array<TEntity | null>> {
    const findPromises = seeds.map((seed) =>
      repository.findOneBy(entityConditionAlreadyExists(seed)),
    );

    const res = await Promise.all(findPromises);

    return res;
  }

  private getNewSeeds<TEntity extends DefaultEntity>(
    seeds: Array<DeepPartial<TEntity>>,
    foundSeeds: Array<TEntity | null>,
  ): Array<{ seedEntity: DeepPartial<TEntity> }> {
    const seedsToCreate: Array<{
      seedEntity: DeepPartial<TEntity>;
    }> = [];

    for (const [index, seed] of seeds.entries()) {
      if (!foundSeeds[index]) {
        seedsToCreate.push({ seedEntity: seed });
      }
    }

    return seedsToCreate;
  }

  private async saveSeeds<TEntity extends DefaultEntity>(
    repository: Repository<TEntity>,
    newSeeds: Array<{ seedEntity: DeepPartial<TEntity> }>,
  ) {
    const entities = newSeeds.map((seed) => repository.create(seed.seedEntity));

    // eslint-disable-next-line unicorn/catch-error-name
    return repository.save(entities).catch((err) => {
      throw new err();
    });
  }
}
