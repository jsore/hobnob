#!/usr/bin/env bash


# don't bind a process to the port used by my API server
# if netstat -lnt | grep -q :$SERVER_PORT; then
if lsof -nP -i4TCP:8888 | grep LISTEN; then
  process=`lsof -t -i :8888`
  echo "process $process"
  echo "Another process is already listening on port $SERVER_PORT"
  kill -9 $process
  #exit 1;
fi


# verify there's an Elasticsearch instance running for the
# API server to hit
#
# Reminder: tests are running against test DB index only
#
# Linux flavored
#RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}
#if ! systemctl --quiet is-active elasticsearch.service; then
#  sudo systemctl start elasticsearch.service
#  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null; do
#    sleep $RETRY_INTERVAL
#  done
#fi
RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}
if ps aux | grep 'elasticsearch' | grep -vq 'grep'; then
  echo "Elasticsearch running and ready for tests"
else
  echo "Elasticsearch not running, restarting"
  brew services start elasticsearch
  echo "Waiting for Elasticsearch..."
  # echo "$ELASTICSEARCH_HOSTNAME $ELASTICSEARCH_PORT $ELASTICSEARCH_INDEX"
  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null; do
    sleep $RETRY_INTERVAL
  done
fi

# init API server as background process and wait until up
yarn run serve &
RETRY_INTERVAL=0.2
# until ss -lnt | grep -q :$SERVER_PORT; do
# until netstat -lnt | grep -q :$SERVER_PORT; do
until lsof -nP -i4TCP:8888 | grep LISTEN; do
  sleep $RETRY_INTERVAL
done


# run tests against the running API server then cleanup all
# background processes to prep for new tests
npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
kill -15 0
#curl $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null

# cleaning the test index if it exists still
curl --silent -o /dev/null -X DELETE "$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"
