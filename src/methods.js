import { NotFoundError } from "@rugo-vn/exception"

export const isConfig = async function({ root, driveName, spaceId }) {
  if (!this.registers[root])
    throw new NotFoundError(`Drive "${driveName}" is not found in "${spaceId}"`);
}