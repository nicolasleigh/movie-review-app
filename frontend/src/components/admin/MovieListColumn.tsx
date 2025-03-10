import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import MovieListColumnAction from "./MovieListColumnAction";
import i18n from "@/utils/i18n";

export type Movie = {
  poster: string;
  title: string;
  status: "public" | "private";
  genres: string[];
};

export const columns: ColumnDef<Movie>[] = [
  {
    accessorKey: "poster",
    header: "TablePoster",
    cell: ({ row }) => {
      const value = row.getValue("poster");
      return (
        <div className="w-20 sm:w-28">
          <img src={value} alt="Poster image" className="w-full rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "TableTitle",
    cell: ({ row }) => {
      const movieId = row.original.id;
      const title = `movies.${movieId}.title`;
      return (
        <div className="capitalize text-[10px] sm:text-xs lg:text-sm">
          {i18n.t(title)}
        </div>
      );
    },
  },
  {
    accessorKey: "genres",
    header: "TableGenres",
    cell: ({ row }) => {
      const value = row.getValue("genres");
      const vl = value.map((e) => {
        return (
          <Badge
            key={e}
            className="text-[8px] rounded-sm max-sm:px-1 max-sm:py-0 max-sm:bg-muted-foreground sm:rounded-full  sm:text-xs"
          >
            {i18n.t(`genres.${e}`)}
          </Badge>
        );
      });
      return <div className="flex gap-[1px] sm:gap-1 flex-wrap ">{vl}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "TableStatus",
    enableHiding: true,
    cell: ({ row }) => {
      const value = row.getValue("status");
      return (
        <div className="capitalize  text-xs lg:text-sm">{i18n.t(value)}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <MovieListColumnAction movieId={row.original.id} />;
    },
  },
];
