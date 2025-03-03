import { useState } from "react";
import { renderItem } from "../utils/helper";
import LiveSearch from "./LiveSearch";
import { useSearch } from "../hooks";
import { searchActor } from "../api/actor";

function WriterSelector({ updateWriter, value, setValue, onSelect, ...props }) {
  // const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    setValue("");
    updateWriter(profile);
    onSelect(profile.id);
    setProfiles([]);
    resetSearch();
  };

  return (
    <LiveSearch
      name="writers"
      placeholder="Search profile..."
      results={profiles}
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
      onUpdate={updateWriter}
      setValue={setValue}
      {...props}
    />
  );
}

export default WriterSelector;
