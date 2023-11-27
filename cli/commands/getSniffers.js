import ServerAxios from "./serverAxios.js";
import Table from "cli-table3";
import chalk from "chalk";
import { getSniffers } from "./api.js";

const listSniffers = async () => {
  const sniffers = await getSniffers().catch((err) => {
    const errorMessage =
      chalk.bgRed.white.bold(" 🦈 Shark Alert! ") +
      chalk.red(
        "\nWe hit a reef while trying to fetch the sniffers.\n",
      );

    console.log(errorMessage);
    process.exit(1);
  });

  const table = new Table({
    head: ["Name", "Downstream URL", "Local Port", "Subdomain"],
    colWidths: [20, 30, 20],
  });
  sniffers.forEach((sniffer) => {
    table.push([sniffer.name, sniffer.downstreamUrl, sniffer.port || "N/A", sniffer.subdomain]);
  });

  // Print the table
  console.log(table.toString());
};

export default listSniffers;
